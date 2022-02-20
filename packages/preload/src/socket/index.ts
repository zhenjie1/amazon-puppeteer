import { onUnmounted } from 'vue'
import { socketPoolOptions, SocketPoolOptions } from './event'
import SocketListener from './socket'

export const sockets = new SocketListener('wss://test-app.niubeiapp.com/ws')
sockets.startConnect()
window.socketObj = sockets

export function useSocket() {
	// receive 添加的事件监听在此存储一份, 方便 onUnmounted 时删除事件监听
	const receivePools: [SocketWatchKeys, Function][] = []

	// 页面卸载时清除添加的事件监听
	onUnmounted(() => {
		receivePools.map((v) => {
			sockets.event.remove(v[0], v[1])
		})
	})

	return {
		ready: sockets.ready,
		reconnectCount: sockets.reconnectCount,
		send: (name: SocketNameKeys, data: any) => sockets.send(name, data),
		receive(
			key: SocketNameKeys | GlobalRefreshTagKeys,
			cb: SocketNameData,
			options: SocketPoolOptions = socketPoolOptions
		) {
			sockets.event.add(key, cb, options)
			receivePools.push([key, cb])
		},
	}
}

// 公共参数
type SocketParamPublic<T = any> = {
	code: number
	data: T
}

// 定义 tag keys (全剧刷新的 tag)
type GlobalRefreshTagKeys = 311

// 定义 socket 接收的  key, value
type SocketContext = {
	login(data: SocketParamPublic): void
	reloadContact(data: SocketParamPublic): void
	codeError(data: SocketParamPublic): void
}

export type SocketNameKeys = keyof SocketContext
export type SocketNameData = SocketContext[SocketNameKeys]
export type SocketWatchKeys = GlobalRefreshTagKeys | SocketNameKeys
