import { TaskAsin, TaskPage } from './taskChild.js'
import { createSpecifyNumberArr, getLastPageNum, getPageKey, getSpecifyPage } from '../../../utils/tools'

export default class Task {
	constructor ({ info, asinList, url }) {
		this.url = url
		/**
		 * @type {object}
		 */
		this.info = info
		this.domain = this.info.market_site.site_domain

		this.asinList = asinList || []

		/**
		 * @type {(TaskAsin | TaskPage)[]}
		 */
		this.tasks = []

		/**
		 * @type {number} 同时开启 browser 的最大数
		 */
		this.asyncWinMaxNumber = 4
	}

	async run () {
		await this.createTaskChild()
		this.tasks.map((task) => task.run())
	}

	async createTaskChild () {
		const { asyncWinMaxNumber, asinList, info } = this
		this.tasks = []
		const isTypeAsin = info.mold === 3
		const [startNum, max] = info.filters.pages
		const createTaskChild = (asins) => {
			const taskChild = new TaskAsin({
				info,
				asinList: asins,
			})
			this.tasks.push(taskChild)
		}

		if (isTypeAsin) {
			if (asinList.length > asyncWinMaxNumber * 5) {
				const singleNum = Math.ceil(asinList.length / asyncWinMaxNumber)
				createSpecifyNumberArr(asyncWinMaxNumber).map((_, i) => {
					const asins = asinList.slice(i * singleNum, (i + 1) * singleNum)
					createTaskChild(asins)
				})
			} else {
				createTaskChild(asinList)
			}
		} else {
			const url = this.url
			let endNum = 7 // await getLastPageNum(url, this.domain)
			// console.log('endNum', endNum)

			if (startNum > endNum) throw new Error('最小页数过大')

			// 最后一个
			endNum = max > endNum ? endNum : max
			const calc = endNum - startNum + 1
			const maxWin = calc > asyncWinMaxNumber ? asyncWinMaxNumber : calc
			const itemLen = Math.ceil(calc / maxWin)
			console.log('采集页数', calc, '结尾页数', endNum, 'win数量', maxWin, '每页', itemLen)

			console.log(getSpecifyPage(url, { domain: this.domain, index: 4 }))
			// const taskChild = new TaskPage({
			// 	url,
			// 	info,
			// 	min: 2,
			// 	max: 2,
			// })
			// this.tasks.push(taskChild)

			createSpecifyNumberArr(maxWin).map((_, i) => {
				let start = startNum + i * itemLen
				let end = start + itemLen - 1
				if (start > endNum) return console.log('无需创建')
				end = end > endNum ? endNum : end
				console.log('start', start, 'end', end)
				// console.log(start, end)
				const taskChild = new TaskPage({
					url,
					info,
					min: start,
					max: end,
				})
				this.tasks.push(taskChild)
			})
		}
	}
}
