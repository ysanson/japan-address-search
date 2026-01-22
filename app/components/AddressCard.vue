<script setup lang="ts">
import type { PostalCodeAddresses, Address } from "@/types/apiResponse";
import { Map } from "lucide-vue-next";

defineProps<{
	addresses: PostalCodeAddresses;
	isHistory?: boolean;
}>();

function getMapsUrl(address: Address): string {
	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatFullAddress(address))}`;
}
</script>
<template>
	<article :class="isHistory ? 'history-card-background' : ''">
		<header :class="isHistory ? 'history-header-background' : ''">
			郵便番号: {{ addresses[0]?.zipcode }}
		</header>
		<template v-for="(address, i) in addresses" :key="i">
			<div class="address-line">
				<div>
					<p>
						{{ formatFullAddress(address) }}
					</p>
					<small>
						{{ formatFullKana(address) }}
					</small>
				</div>

				<a
					class="outline"
					:href="getMapsUrl(address)"
					target="_blank"
					role="button"
				>
					<Map />
				</a>
			</div>
			<hr v-if="i !== addresses.length - 1" />
		</template>
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

.address-line {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 0.75rem;

	> a[role="button"] {
		flex-shrink: 0;
		padding: 0.25rem 0.4rem;
		min-width: auto;
	}

	> div {
		flex: 1;
		min-width: 0;
	}

	p {
		margin-bottom: 0.25rem;
	}

	small {
		margin-top: 0;
		display: block;
	}
}

@media (max-width: 1024px) {
	.address-line {
		flex-direction: column;
		align-items: flex-start;

		a[role="button"] {
			align-self: flex-start;
		}
	}
}
</style>
