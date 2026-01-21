<script setup lang="ts">
import type { PostalCodeAddresses } from "@/types/apiResponse";
defineProps<{
	addresses: PostalCodeAddresses;
	isHistory?: boolean;
}>();
</script>
<template>
	<article :class="isHistory ? 'history-card-background' : ''">
		<header :class="isHistory ? 'history-header-background' : ''">
			郵便番号: {{ addresses[0]?.zipcode }}
		</header>
		<div v-for="(address, i) in addresses" :key="i">
			{{ formatFullAddress(address) }} <br />
			{{ formatFullKana(address) }}
			<hr v-if="i !== addresses.length - 1" />
		</div>
	</article>
</template>
<style lang="scss">
.history-header-background {
	background-color: var(--history-header-bg);
	color: var(--pico-contrast-color);
}

.history-card-background {
	background-color: var(--history-bg);
	color: var(--pico-contrast-color);
}

/* Light mode */
[data-theme="light"],
:root:not([data-theme="dark"]) {
	--history-header-bg: var(--pico-color-grey-200);
	--history-bg: var(--pico-color-grey-150);
}

/* Dark mode */
@media only screen and (prefers-color-scheme: dark) {
	:root:not([data-theme]) {
		--history-header-bg: var(--pico-color-slate-600);
		--history-bg: var(--pico-color-slate-500);
	}
}
</style>
