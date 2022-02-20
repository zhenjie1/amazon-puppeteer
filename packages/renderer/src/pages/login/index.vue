<template>
	<div class="login">login</div>
</template>

<script lang="ts" setup>
import { api } from 'rederer/api/index'

async function init() {
	const code = await api.login.getCode()
	console.log(code)
}

init()
// console.log('login', api)
</script>
