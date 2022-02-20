import { useAxios } from './fetch'

export const getCode = () =>
	useAxios<{
		captcha_image_content: string
		captcha_key: string
		expired_at: string
	}>({
		url: '/api/common/captcha',
		method: 'get',
		dataPath: 'data.data',
	})

export const login = () =>
	useAxios({
		url: '/userLogin',
	})
