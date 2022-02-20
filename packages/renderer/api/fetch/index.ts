import { useAxios } from './fetch'
export * from './cache'
export * from './defaultParams'
export * from './fetch'
export * from './url'

const { success, fail } = useAxios({
	url: '/videoCategoryDetails?id=14',
	method: 'get',
	store: true,
}).start()

success((res) => {
	console.log('res', res)
})
fail((error) => {
	console.log('error', error.response)
})
