import axios, { AxiosError, AxiosResponse, CancelTokenSource } from 'axios'
import { computed, ref, shallowRef } from 'vue'
import defaultParams, { removeSurplusData } from './defaultParams'
import { getData } from './url'
import { APIFetchReturn, FetchResult, Params, readCache } from './utils'

type Success<T> = (data: T) => void
type Fail<T> = (error: AxiosError<T>) => void

/**
 * Wrapper for axios.
 *
 * @see https://vueuse.org/useAxios
 * @param url
 * @param config
 */
export function useAxios<T = any>(config: Params): APIFetchReturn<T> {
	const response = shallowRef<AxiosResponse<T>>()
	const sourceData = shallowRef<FetchResult<T>>()
	const data = computed<T>(() => getData(config, sourceData.value))
	const isFinished = ref(false)
	const isLoading = ref(true)
	const aborted = ref(false)
	const error = shallowRef<AxiosError<T>>()
	const successPool: Success<T>[] = []
	const failPool: Fail<T>[] = []

	const cancelToken: CancelTokenSource = axios.CancelToken.source()
	const abort = (message?: string) => {
		if (isFinished.value || !isLoading.value) return

		cancelToken.cancel(message)
		aborted.value = true
		isLoading.value = false
		isFinished.value = false
	}

	const result: APIFetchReturn<T> = {
		response,
		sourceData,
		data,
		error,
		finished: isFinished,
		loading: isLoading,
		isFinished,
		success: (cb: Success<T>) => successPool.push(cb),
		fail: (cb: Fail<T>) => failPool.push(cb),
		isLoading,
		cancel: abort,
		canceled: aborted,
		aborted,
		abort,
		start,
	}

	config = defaultParams(config)

	readCache(config, result)

	function start(params?: any): APIFetchReturn<T> {
		config.data = removeSurplusData(params)
		axios({ ...config, cancelToken: cancelToken.token })
			.then((r: any) => {
				response.value = r
				sourceData.value = r.data

				if (r.data.code !== 200) failPool.map((fn) => fn(r))
				else successPool.map((fn) => fn(data.value!))
			})
			.catch((e: any) => {
				error.value = e
				failPool.map((fn) => fn(e))
			})
			.finally(() => {
				isLoading.value = false
				isFinished.value = true
			})
		return result
	}

	return result
}
