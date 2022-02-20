import Parse from './parse'

class TaskBase {
	constructor (options) {
		this.asinList = options.asinList || []
		this.url = options.url

		/**
		 * @type {object}
		 */
		this.info = options.info || {}
		this.domain = this.info.market_site.site_domain

		/**
		 * @type {number} 同时开 tag 的最大数
		 */
		this.asyncTagMaxNumber = 3

		/**
		 * @type {Parse}
		 */
		this.parse = new Parse({ task: this })
	}

	setData (key, value) {
		this[key] = value
	}

	// 执行完一页时的回调
	pageCallback ({ pages }) {
		console.log('执行一页回调', pages)
	}

	// 执行完某页中某个 asin 时的回调
	asinCallback ({ pages }) {
		// console.log('执行单个回调', pages)
	}
}

export class TaskAsin extends TaskBase {
	async run () {
		await this.parse.handlerAsinList(this, {
			asins: this.asinList,
			syncNum: this.asyncTagMaxNumber,
		})
		this.pageCallback()
	}
	pageCallback () {
		console.log('执行完毕')
	}
}

export class TaskPage extends TaskBase {
	constructor (options) {
		super(options)

		this.min = options.min
		this.max = options.max
	}
	async run () {
		if (!this.url) return console.log('请检查 url')
		await this.parse.parseAllPage(this.url, this)
	}
}
