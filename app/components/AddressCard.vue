<script setup lang="ts">
import type { PostalCodeAddresses } from "@/types/apiResponse";
defineProps<{
	addresses: PostalCodeAddresses;
	isHistory?: boolean;
}>();
</script>
<template>
	<article>
		<header :class="isHistory ? 'pico-background-grey-200' : ''">
			郵便番号: {{ addresses[0]?.zipcode }}
		</header>
		<div v-for="(address, i) in addresses" :key="i">
			{{ `${address.address1}${address.address2}${address.address3}` }} <br />
			{{ `${address.kana1}${address.kana2}${address.kana3}` }}
			<hr />
		</div>
	</article>
</template>
