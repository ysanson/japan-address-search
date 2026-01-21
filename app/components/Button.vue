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
	<button :type="type" :class="[color ? color : '', outline ? 'outline' : '']">
		{{ label }}
	</button>
</template>
