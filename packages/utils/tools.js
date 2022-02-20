const axios = require('axios')
import cheerio from 'cheerio'

/**
 * 生成指定数量的数组
 */
export const createSpecifyNumberArr = (num) => {
	return new Array(num).fill(undefined)
}

/**
 * 获取页面中，最后一页的页数
 * @param {string} url url
 * @param {string} domain domain
 * @returns {number}
 */
export const getLastPageNum = async (url) => {
	const res = await axios.get(url)

	const $ = cheerio.load(res.data)
	const n1 = $('span.s-pagination-item.s-pagination-disabled').last().text()
	const n2 = $('li.a-last')

	let lastNum = parseInt(n1 || n2) || 0
	return lastNum
}

/**
 * 获取指定页数的链接地址
 * @param {string} url url
 * @param {object} options options
 * @param {string} options.domain domain
 * @param {number} options.index index
 * @returns {string}
 */
export const getSpecifyPage = (url, { domain, index }) => {
	console.log('getSpecifyPage', url)
	url = linkComplete(url, domain)
	let key = getPageKey(url, domain)
	let path = new URL(url)
	path.searchParams.set(key, index)
	return path.href
}

/**
 * 获取链接地址中代表页数的 key
 * @param {string} url url
 * @param {string} domain domain
 * @returns {string} key
 */
export function getPageKey (url, domain) {
	let keys = ['pg', 'page']
	url = linkComplete(url, domain)
	const nextUrl = new URL(url)
	const key = keys.reduce((key, k) => {
		if (key) return key
		if (nextUrl.searchParams.get(k)) return k
	}, '')

	if (!key) throw new Error(`未获取到页面key ${url}`)
	return key
}

/**
 * 获取链接上的页数
 * @param {string} url 链接地址
 * @returns {number}
 */
export const getPageIndex = (url, domain) => {
	if (!url) return url
	let key = getPageKey(url, domain)
	const nextUrl = new URL(url)
	const page = nextUrl.searchParams.get(key) || '1'
	return parseInt(page)
}

/**
 * 链接补全
 * @param {string} url 链接地址
 * @param {string} domain 域名
 * @param {object} params 查询参数
 * @returns {string}
 */
export const linkComplete = (url, domain, params = {}) => {
	let path = url
	if (url.charAt() === '/') path = domain + url
	if (url.charAt().toLocaleUpperCase() === 'B') {
		path = `${domain}dp/product/${url}?th=0&psc=1`
	}

	const newUr = new URL(path)
	for (const k in params) newUr.searchParams.set(k, params[k])

	return newUr.href
}

//生成从minNum到maxNum的随机数
export function randomNum (min, max) {
	return parseInt(Math.random() * (max - min + 1) + min)
}

/**
 * 延迟一定时间
 * @param {number} time 时间 ms
 * @returns {Promise<any>}
 */
export const delayWait = (time = 0, time2) => {
	if (time2) new Promise((resolve) => setTimeout(resolve, randomNum(time, time2)))

	return new Promise((resolve) => setTimeout(resolve, time))
}
