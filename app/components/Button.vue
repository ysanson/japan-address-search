<script setup lang="ts">
interface ButtonProps {
	type: "button" | "submit";
	label: string;
	color?: "secondary" | "contrast";
	outline?: boolean;
	loading?: boolean;
	disabled?: boolean;
}
defineProps<ButtonProps>();
</script>
<template>
	<button
		class="japanese-button"
		:type="type"
		:disabled="disabled || loading"
		:class="[color ? color : '', outline ? 'outline' : '']"
	>
		<template v-if="loading">
			<div class="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		</template>
		<template v-else>
			{{ label }}
		</template>
	</button>
</template>
<style lang="scss" scoped>
.japanese-button {
	white-space: nowrap;
}
</style>
