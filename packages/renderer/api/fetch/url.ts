import { get } from 'lodash'
import { Params } from './utils'

const ajaxKey = localStorage.getItem('ajaxKey') || 'online'

/**
 * 获取请求头
 * @returns {string} 返回结果
 */
export const ajaxPath = () => {
  // if (ajaxKey === 'online') return `${location.protocol}//${location.host}`

  // return `${location.protocol}//www.baidu.com${location.host}`
  return `/${ajaxKey}`
}

export type FetchResult<T = Data> = {
  code: number
  data: T
  msg?: string
}

/**
 * 通过 lodash.get 获取数据
 */
export function getData<T>(config: Params, data: any): T {
  if (config.dataPath) return get(data, config.dataPath)

  return data
}
