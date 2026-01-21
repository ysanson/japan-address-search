<script setup lang="ts">
interface ButtonProps {
	type: "button" | "submit";
	label: string;
	color?: "secondary" | "contrast";
	outline?: boolean;
}
defineProps<ButtonProps>();
</script>
<template>
	<button
		class="japanese-button"
		:type="type"
		:class="[color ? color : '', outline ? 'outline' : '']"
	>
		{{ label }}
	</button>
</template>
<style lang="scss" scoped>
.japanese-button {
	white-space: nowrap;
}
</style>
