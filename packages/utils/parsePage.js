import { linkComplete } from './tools'

const puppeteer = require('puppeteer')

/**
 * 创建一个 browser
 */
export async function createBrowser () {
	return await puppeteer.launch({
		headless: false,
	})
}
/**
 * 获取页面内的 asin href
 * @param {puppeteer.Page} page Page
 * @param {Task} task task
 * @returns {string[]}
 */
export async function getAsinHref (page, task) {
	let result = await page.$eval('#a-page', (body) => {
		const doms = Array.from(body.querySelectorAll('.s-result-item[data-asin^=B]'))

		return doms.map((d) => {
			const a = d.getElementsByTagName('a')[0]
			return a.getAttribute('href')
		})
	})

	result = result.map((link) => linkComplete(link, task.domain))
	return result
}

/**
 * 获取页面内的 asin href
 * @param {puppeteer.Page} page Page
 * @returns {string}
 */
export async function getNextPageUrl (page) {
	const nextPage = await page.$eval('.s-pagination-strip .s-pagination-selected', (dom) => {
		if (dom) {
			const a = dom.nextSibling.nodeName === 'A' ? dom.nextSibling : null
			if (a) return location.origin + a.getAttribute('href')
		}
		return null
	})
	return nextPage
}

/**
 * 创建一个页面
 * @param {puppeteer.Browser} browser browser
 * @param {boolean} isIntercept 是否拦截
 * @returns {puppeteer.Page} 返回页面对象
 */
export async function createPage (browser, isIntercept = true) {
	const page = await browser.newPage()

	if (isIntercept) {
		page.setRequestInterception(true)
		page.on('request', (request) => {
			if (['image', 'stylesheet', 'font', 'script'].indexOf(request.resourceType()) !== -1) {
				request.abort()
			} else {
				request.continue()
			}
		})
	}

	return page
}
