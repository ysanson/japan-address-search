<script setup lang="ts">
const { lastAddress } = storeToRefs(useAddressStore());
</script>
<template>
	<div class="container page-content">
		<AddressForm />
		<AddressCard v-if="!!lastAddress" :addresses="lastAddress" />
		<h2>History</h2>
		<Carousel v-if="!!lastAddress" />
		<span v-else>No history yet.</span>
	</div>
</template>
