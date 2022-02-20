<template>
	<img alt="Vue logo" src="../assets/logo.svg" width="200" />
	<h3>哈哈哈哈哈哈哈</h3>
	<app-navigation />
	<button @click="hander">fetch</button>
	<router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppNavigation from '/@/components/AppNavigation.vue'
export default defineComponent({
	name: 'App',
	components: {
		AppNavigation,
	},
	methods: {
		hander () {
			fetch("http://192.168.3.230:4567")
		}
	}
})
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 60px;
}
</style>
