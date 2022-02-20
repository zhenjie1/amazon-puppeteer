import { SocketWatchKeys } from '.'

export type SocketPoolOptions = {
	immediate: boolean
}

export type SocketPoolContent = {
	callback: (...params: any[]) => any
} & SocketPoolOptions

// 默认参数
export const socketPoolOptions = {
	immediate: false,
}

// 事件
export default class SocketEvent {
	// 存储器
	socketPools = new Map<string | number, SocketPoolContent[]>()

	// 添加一个
	add(
		key: string | number,
		cb: SocketPoolContent['callback'],
		options: SocketPoolOptions = socketPoolOptions
	) {
		const target = this.socketPools.get(key)
		const content = {
			immediate: options.immediate || false,
			callback: cb,
		}

		if (target) {
			if (!target.map((v) => v.callback).includes(cb)) target.push(content)
		} else {
			this.socketPools.set(key, [content])
		}
	}

	// 删除一个
	remove(key: SocketWatchKeys | number, cb: Function) {
		const target = this.socketPools.get(key)
		if (!target) return

		const index = target.findIndex((v) => v.callback === cb)
		if (index === -1) return

		target.splice(index, 1)
	}

	// 循环执行
	emit(key: string | number, ...data: any[]) {
		const target = this.socketPools.get(key)
		if (!target) return

		target.map((content) => {
			if (typeof content.callback !== 'function') return
			content.callback(...data)
		})
	}
}
