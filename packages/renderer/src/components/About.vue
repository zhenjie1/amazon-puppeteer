<template>
	<div>
		<ul aria-labelledby="versions">
			<li v-for="(version, lib) in versions" :key="lib">
				<strong>{{ lib }}</strong>
				<span>: v{{ version }}</span>
			</li>
		</ul>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
	name: 'App',
	setup() {
		return {
			versions: window.versions,
		}
	},
})
</script>

<style scoped>
div {
	text-align: left;
	display: grid;
	justify-content: center;
}
</style>
