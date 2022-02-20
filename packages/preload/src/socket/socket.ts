import initSocketEvent, { socketAbnormal } from './socketEvent'
import SocketEvent from './event'
import { ref } from 'vue'

export default class SocketListener {
	event: SocketEvent = new SocketEvent()
	ca: any

	/**
	 * 请求地址
	 */
	url: string
	/**
	 * readyState: socket 连接状态
	 * 0: 正在建立连接连接，还没有完成
	 * 1: 连接成功建立，可以进行通信
	 * 2: 连接正在进行关闭握手，即将关闭
	 * 3: 连接已经关闭或者根本没有建立
	 */
	sockets?: WebSocket

	/**
	 * 是否已经连接成功了
	 */
	ready = ref(true)

	/**
	 *  重连次数
	 */
	reconnectCount = ref(0)

	/**
	 * 心跳的间隔时间
	 */
	heartbeatTime = 10

	/**
	 * 准备发送但因 socket 状态异常未发送的数据
	 * 将在 socket 重连成功后尝试发送
	 */
	sendPools: { name: string; data: string }[] = []
	heartbeatTimeObj?: NodeJS.Timeout // 心跳定时器对象

	/**
	 * 开始建立连接
	 */
	startConnect() {
		// 重连次数增加
		this.reconnectCount.value++

		const isopen = this.createSocket()
		if (!isopen) return

		initSocketEvent(this)
		this.initHeartbeat()
	}

	constructor(url: string) {
		this.url = url
		window.addEventListener('online', () => {
			this.close()
		})
		window.addEventListener('offline', () => {
			this.close()
		})
	}

	/**
	 * 创建一个 socket 连接
	 * @param {string?} accessToken token
	 * @returns {boolean} true: 允许连接, false: 不允许连接
	 */
	createSocket(): boolean {
		// 如果正在连接中或已经连上了, 无需再连
		if (this.sockets && [0, 1].includes(this.sockets.readyState)) {
			console.warn(`因为 readyState = ${this.sockets.readyState} 而取消连接`)
			return false
		}

		// 是否允许连接
		if (!this.isConnect()) {
			console.warn('因不满足重连条件而取消连接')
			return false
		}

		this.sockets = new WebSocket(this.url)

		this.event.add('connect', () => {
			this.ready.value = true
			this.reconnectCount.value = 0
		})
		this.event.add('disconnect', () => {
			this.ready.value = false
		})

		setTimeout(() => {
			if (this.sockets?.readyState === 1) return

			// 断开连接进入重连, 这里无需写重连, 引开断开后会自动重连
			this.sockets?.close()
		}, 8000)

		return true
	}

	// 是否允许连接 socket; tru: 允许连接, false: 不允许连接
	isConnect(): boolean {
		return true
	}

	// 关闭 webSocket 连接
	close() {
		if (this.sockets) {
			if (this.sockets.readyState === 1) {
				this.ready.value = false
				this.sockets.close()
			}
		}
	}

	// 心跳
	initHeartbeat() {
		if (this.heartbeatTimeObj) clearInterval(this.heartbeatTimeObj)

		this.heartbeatTimeObj = setInterval(() => {
			if (this.sockets?.readyState !== 1) return

			this.send('heartBeat', { accessToken: 'token-test' })
		}, this.heartbeatTime * 1000)
	}

	// 发送消息
	send({ event, type } = {} as SocketEvent): void {
		const sendData = JSON.stringify(data)

		if (this.sockets) {
			const readyState = this.sockets.readyState
			if (readyState === 1) this.sockets.send(sendData)
			else this.sendPools.push({ name: name, data: sendData })

			// 异常状态, 开始进行重连
			if (![0, 1].includes(readyState)) this.reconnect()
		} else {
			this.reconnect()
		}
	}

	// 重连
	reconnect() {
		this.close()
		this.startConnect()
	}
}

/**
 * socket 收到的数据结构 - 公共结构
 */
export interface SocketMessageReceiveComment {
	event: string
	type: string
}
