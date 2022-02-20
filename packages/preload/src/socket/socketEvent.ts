import SocketListener from './socket'
import { debounce } from 'lodash'
import { strToJsonDeep } from 'preload/src/utils/'

/**
 * 初始化 socket 的事件
 *
 * @param {Sockets} socketListener Sockets 类
 * @returns {void} 无返回值
 */
export default function initSocketEvent(socketListener: SocketListener) {
	const socket: WebSocket = socketListener.sockets!

	socket.onmessage = function socketMessage(event) {
		const data = strToJsonDeep(event.data)

		const name = data?.data?.msgType || 'emptyName'
		socketListener.event.emit(name, data)
	}

	socket.onopen = function open() {
		console.log('连接成功')

		// 发送连接成功事件
		socketListener.event.emit('connect')

		// 将未发送的数据发送出去
		socketListener.sendPools.map((val) => {
			socketListener.send(val.name, val.data)
		})
	}

	/**
	 * 每次 close、error 后立即开始重连
	 * 而由于重连会检查是否满足连接的条件,以此来防止死循环
	 */
	socket.onclose = function close(e) {
		console.error('连接已断开', e.code, e)

		// 发送连接断开事件
		socketListener.event.emit('disconnect')

		// socket 异常回调
		socketError(socketListener)
	}

	/**
	 * 每次 close、error 后立即开始重连
	 * 而由于重连会检查是否满足连接的条件,以此来防止死循环
	 */
	socket.onerror = function error() {
		console.error('报错了')

		// 发送连接断开事件
		socketListener.event.emit('disconnect')

		// socket 异常回调
		socketError(socketListener)
	}
}

// 重连小于一定时间走这个
export const socketAbnormal = debounce(socketDisconnect, 1000)
// 重连次数超过一定次数走这个
export const socketAbnormalMany = debounce(socketDisconnect, 5000)

// socket 关闭或报错 后执行
function socketError(socketListener: SocketListener) {
	if (socketListener.reconnectCount.value <= 3) {
		socketAbnormal(socketListener)
	} else {
		socketAbnormalMany(socketListener)
	}
}

// socket 异常后处理
function socketDisconnect(socketListener: SocketListener) {
	// 重连
	socketListener.reconnect()
}
