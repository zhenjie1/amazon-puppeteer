import axios from 'axios-https-proxy-fix'

/**
 * 获取指定数量的代理ip
 * @param {number} count 最终获取的可用代理ip数量
 * @returns {objecr[]} 返回可用的代理ip数组
 */
export async function getProxyData(count) {
	const proxys = await useIpcRenderApi('apiFetch', {
		path: 'proxy.active',
		params: [count],
	}).then((res) => res.data)

	const proxyAll = await testSpeed(proxys)
	let result = proxyAll.filter((v) => v.status === 'success')
	// 不可用代理 ip 数量
	const calc = proxys.length - result.length

	if (calc > 0) {
		// 标记为不可用的代理ip
		const failProxy = proxyAll.filter((v) => v.status !== 'success')
		win.webContents.send('changeProxys', failProxy)

		console.log('proxy 不够所需数量', proxys.length, result.length)

		// 将新的代理ip合并
		const calcProxy = await getProxyData(calc)
		result = result.concat(calcProxy)
	}
	return result.sort((a, b) => a.usageTime - b.usageTime)
}

/**
 * 对多条 ip 进行测速
 * @param {{ip: string, port: string}[]} options 参数
 */
export async function testSpeed(options, cb) {
	return Promise.all(options.map((v) => singleTest(v))).then((res) => {
		cb && cb(res)
		console.log('所有代理测速完成')
		return res
	})
}

/**
 * 测试单条
 * @param {{ip: string, port: string}} option 参数
 */
function singleTest(option) {
	console.log('开始单个测速', option.ip, option.port)
	const { ip, port } = option
	const proxy = {
		host: ip,
		port,
		auth: {
			username: 'xr6d72',
			password: 'kizunxr4',
		},
	}
	const result = {
		beforeTime: Date.now(),
		usageTime: 0,
		...option,
	}
	const proxyPath = `${ip}:${port}`
	return axios({
		url: 'https://www.amazon.com',
		method: 'get',
		proxy,
		timeout: 10 * 1000,
	})
		.then(() => {
			result.usageTime = Date.now() - result.beforeTime
			result.status = 'success'
			console.log('测速，返回成功', proxyPath)
			return result
		})
		.catch(() => {
			result.status = 'fail'
			result.usageTime = Infinity
			console.log('测速，返回异常', proxyPath)
			return result
		})
}
