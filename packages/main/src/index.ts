import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { URL } from 'url'
import Task from './task/task.js'
// import * as puppeteer from 'puppeteer'
// const puppeteer = require('puppeteer')
import './security-restrictions'

const task = new Task({
	url: 'https://www.amazon.com/s?i=merchant-items&me=A226X21MQYKWYE&page=2&language=zh&marketplaceID=ATVPDKIKX0DER&qid=1645339552&ref=sr_pg_2',
	info: {
		market_site: {
			site_domain: 'https://www.amazon.com/',
		},
		filters: {
			pages: [1, 60],
		},
		mold: 1
	},
	asinList: [
		"B076WV9VZD",
		"B0919ZZ5FF",
		"B07CGKG6HT",
		"B0925BB8YR",
		"B077TMHZ4M",
		"B074Z6LN77",
		"B08F6SVGS9",
		"B07WJM4ZGV",
		"B07SYP2J1K",
		"B074WYMZ4S",
		"B077S7GP5F",
		"B07WGBBCQ9",
		"B07856MBH8",
		"B075JG87BR",
		"B08LMBGH5T",
		"B08PFCXH8F",
		"B07549RXV4",
		"B07WHFPGDF",
		"B07WD74ZBY",
		"B074PPDF5H",
		"B08HMVFXL3",
		"B08QMW73TP",
		"B0774LY1M8",
		"B08V16R38L",
		"B0774LY7RP",
		"B092VYL2FN",
		"B07WJL6X62",
		"B08ZY6CGNJ",
		"B08YNTSQWJ",
		"B084ZJH81L",
		"B08Q44CLF5",
		"B07YDGFJQF"
	]
})

const url =
	'https://www.amazon.com/s?k=quilt&crid=1YOHGS0734SM1&sprefix=%2Caps%2C321&ref=nb_sb_noss'
task.run({
	url,
	type: 'link',
	min: 1,
	max: 50,
})
// console.log(task)
// async function browser() {
// 	console.log(puppeteer)
// 	try {
// 		const browser = await puppeteer.launch({ headless: false })
// 		const page = await browser.newPage()
// 		await page.goto('https://www.baidu.com')
// 	} catch (e: any) {
// 		throw new Error(e)
// 	}
// }

// browser()

const isSingleInstance = app.requestSingleInstanceLock()
const isDevelopment = import.meta.env.MODE === 'development'

if (!isSingleInstance) {
	app.quit()
	process.exit(0)
}

// app.disableHardwareAcceleration()

// Install "Vue.js devtools"
if (isDevelopment) {
	app.whenReady()
		.then(() => import('electron-devtools-installer'))
		.then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
			installExtension(VUEJS3_DEVTOOLS, {
				loadExtensionOptions: {
					allowFileAccess: true,
				},
			})
		)
		.catch((e) => console.error('Failed install extension:', e))
}

let mainWindow: BrowserWindow | null = null

const createWindow = async () => {
	mainWindow = new BrowserWindow({
		show: false, // Use 'ready-to-show' event to show window
		webPreferences: {
			// nativeWindowOpen: true,
			// webSecurity: true,
			// webviewTag: false, // The webview tag is not recommended. Consider alternatives like iframe or Electron's BrowserView. https://www.electronjs.org/docs/latest/api/webview-tag#warning
			preload: join(__dirname, '../../preload/dist/yes.cjs'),
		},
	})

	const testWin = new BrowserWindow({})
	// testWin.webContents.session.setProxy({
	// 	proxyRules: '123.321.123.321:9032',
	// })

	/**
	 * If you install `show: true` then it can cause issues when trying to close the window.
	 * Use `show: false` and listener events `ready-to-show` to fix these issues.
	 *
	 * @see https://github.com/electron/electron/issues/25012
	 */
	mainWindow.on('ready-to-show', () => {
		mainWindow?.show()

		if (isDevelopment) {
			mainWindow?.webContents.openDevTools()
		}
	})

	/**
	 * URL for main window.
	 * Vite dev server for development.
	 * `file://../renderer/index.html` for production and test
	 */
	const pageUrl =
		isDevelopment && import.meta.env.VITE_DEV_SERVER_URL !== undefined
			? import.meta.env.VITE_DEV_SERVER_URL
			: // eslint-disable-next-line no-path-concat
			  new URL('../renderer/dist/index.html', 'file://' + __dirname).toString()

	await mainWindow.loadURL(pageUrl)
}

app.on('second-instance', () => {
	// Someone tried to run a second instance, we should focus our window.
	if (mainWindow) {
		if (mainWindow.isMinimized()) mainWindow.restore()
		mainWindow.focus()
	}
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.whenReady()
	.then(createWindow)
	.catch((e) => console.error('Failed create window:', e))

// Auto-updates
if (import.meta.env.PROD) {
	app.whenReady()
		.then(() => import('electron-updater'))
		.then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
		.catch((e) => console.error('Failed check updates:', e))
}
