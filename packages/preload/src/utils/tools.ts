import { isObject } from 'lodash'

// string 转 json 对象
export function strToJson(str: any): Record<string, any> {
	if (typeof str !== 'string') return str

	try {
		return JSON.parse(str)
	} catch {
		return str as any as Record<string, any>
	}
}

// string | object 深度转为 object 对象
export function strToJsonDeep(val: Record<string, any> | string): any {
	if (!isObject(val)) return strToJson(val)

	for (const i in val) {
		const item = val[i]
		if (i === 'uin') val[i] = parseInt(item)
		else if (isObject(item)) strToJsonDeep(item)
		else if (typeof item === 'string') val[i] = strToJson(item)
	}
	return val
}
