<script setup lang="ts">
const { lastAddress, addresses } = storeToRefs(useAddressStore());
const updated = ref(false);
watch(lastAddress, () => {
	updated.value = true;
	setTimeout(() => (updated.value = false), 200);
});
</script>
<template>
	<div class="container page-content">
		<hgroup class="center-text">
			<h1>住所検索</h1>
			<p>
				郵便番号を入力して住所を検索できます。<br />
				郵便番号はハイフン「ー」有無どちらでも検索可能です。<br />
				（000-0000,0000000 の形式で入力してください。）
			</p>
		</hgroup>
		<div class="half-width">
			<AddressForm />
		</div>
		<Transition name="fade">
			<AddressCard
				class="half-width address-card"
				v-if="!!lastAddress"
				:class="{ flash: updated }"
				:addresses="lastAddress"
			/>
		</Transition>
		<hr />
		<h2>検索履歴</h2>
		<Carousel v-if="addresses.length > 0" />
	</div>
</template>
