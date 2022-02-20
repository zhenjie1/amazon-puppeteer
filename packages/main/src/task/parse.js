import { createBrowser, createPage, getAsinHref, getNextPageUrl } from '../../../utils/parsePage'
import { delayWait, getPageIndex, linkComplete } from '../../../utils/tools'



export default class Parse {
	constructor ({ task }) {
		this.task = task
	}

	/**
	 * 单 asin 解析
	 * @param {string} url 地址
	 * @param {object} options options
	 * @param {puppeteer.Browser} options.browser browser
	 * @param {{ index: number }} options.pages options
	 * @returns {Promise<object>}
	 */
	async parseSingleAsin (url, { browser, pages }) {
		await delayWait(1000, 2000)
		const p = await createPage(browser)
		await p.goto(url, { waitUntil: 'domcontentloaded' })

		// const title = await p.$eval('title', (el) => el.innerHTML)
		// console.log('title', title.substring(10, 30))
		console.log('run index', pages, url)
		// await new Promise((resolve) => setTimeout(resolve, 3000))
		await p.close()
	}

	/**
	 * 处理 asin 列表
	 * @param {Task} task task
	 * @param {object} options options
	 * @param {string[]} options.asins asin 列表
	 * @param {number} options.syncNum 同时跑的个数
	 * @param {puppeteer.Browser} options.browser browser
	 * @param {{ index: number }} options.pages options
	 */
	async handlerAsinList (task, { asins, syncNum, browser, pages = {} }) {
		if (!browser) browser = await createBrowser()
		pages.asinIndex = -1
		if (asins.length === 0) return

		let resolve
		const promise = new Promise((r) => (resolve = r))
		const handler = async (asins) => {
			pages.asinIndex++
			const asinPath = linkComplete(asins[pages.asinIndex], task.domain)
			await this.parseSingleAsin(asinPath, { browser, pages })

			// 执行回调
			if (asins[pages.asinIndex]) task.asinCallback && task.asinCallback({ pages })

			// 有则继续，无则完成
			asins[pages.asinIndex + 1] ? handler(asins) : resolve()
		}

		for (let i = 0; i < syncNum; i++) await handler(asins)
		return promise
	}

	/**
	 * 单页解析
	 * @param {string} url 地址
	 * @param {Task} task task
	 * @param {object} options options
	 * @param {{ index: number }} options.pages options
	 * @returns {Promise<{ nextPageUrl: string }>}
	 */
	async parseSinglePage (url, task, options) {
		const { pageCallback } = task
		const { pages } = options
		const browser = await createBrowser()
		const page = await createPage(browser, false)
		await page.goto(url, { waitUntil: 'domcontentloaded' })

		const title = await page.$eval('title', (el) => el.innerText)
		if (title === 'Sorry! Something went wrong!') {
			console.log('重新设置地址')
			await page.goto(url, { waitUntil: 'domcontentloaded' })
		}

		const asins = await getAsinHref(page, task)
		task.asinList = asins

		// console.log(asins)
		await this.handlerAsinList(task, { asins, syncNum: task.asyncTagMaxNumber, browser, pages })

		// 执行回调
		pageCallback && pageCallback({ pages })

		let curPage = getPageIndex(url, task.domain)
		let nextPageUrl = await getNextPageUrl(page, task.domain)

		// max 页数限制
		const { max } = task
		console.log('current page', curPage, url)
		console.log('next page', nextPageUrl)
		// if (!nextPageUrl) console.log('url', url)
		const nextPage = getPageIndex(nextPageUrl)
		if (!nextPageUrl || curPage >= max) {
			nextPageUrl = ''
			console.log('停止 ->', max, nextPage)
		}

		page.close()
		console.log('下一个 path', nextPageUrl, browser.isConnected())
		delayWait(10 * 1000).then(() => {
			if (browser.isConnected()) browser.close()
		}).catch(() => {})

		return { nextPageUrl }
	}

	/**
	 * 解析所有页面
	 * @param {string} url url
	 * @param {Task} task task
	 * @param {object} options options
	 * @param {{ index: number }} options.pages options
	 */
	async parseAllPage (url, task, options = {}) {
		const { pages = { index: 0 } } = options

		options.pages = pages
		options.pages.index++

		const result = await this.parseSinglePage(url, task, options)

		if (result && result.nextPageUrl) await this.parseAllPage(result.nextPageUrl, task, options)
	}
}
