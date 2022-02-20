import type { Params, Config } from './utils'
import { ajaxPath } from './url'

/**
 * - 发请求前认为无效的值
 * - 当value 为以下值时，将会视为无效并删除
 */
export const apiInvalidValue = [null, undefined, '']

/**
 * 默认参数处理
 */
export default function defaultParams(params?: Params) {
	if (!params) throw new Error('参数异常！')

	// headers 处理
	const headers: Data = { token: 'this is at headers' }
	if (params.file) headers['Content-Type'] = 'application/json;charset=UTF-8'
	params.headers = headers

	const { url } = params

	params.url = `${ajaxPath()}${url}`

	params.dataPath = params.dataPath || 'result'
	params.method = (params.method || 'post').toLocaleUpperCase() as any
	params.isCode = params.isCode || true
	params.exclude = params.exclude || apiInvalidValue
	params.codeErrorMessage = params.codeErrorMessage || true
	params.file = params.file || false
	params.data = removeSurplusData(params.data) || {}

	return params as Params & Required<Config>
}

// 删除多余参数
export function removeSurplusData(data: any) {
	if (!data) return data

	// 对象类型
	if (data.constructor === Object) {
		// eslint-disable-next-line no-restricted-syntax
		for (const i in data) {
			if (apiInvalidValue.includes(data[i])) delete data[i]
		}
	}
	// 数组类型
	else if (data.constructor === Array) {
		if (data.length === 0) return data

		data = data.filter((v) => !apiInvalidValue.includes(v))
	}

	return data
}
