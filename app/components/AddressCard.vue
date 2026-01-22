<script setup lang="ts">
import type { PostalCodeAddresses, Address } from "@/types/apiResponse";
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
					<svg
						class="lucide lucide-map-icon lucide-map"
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path
							d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
						/>
						<path d="M15 5.764v15" />
						<path d="M9 3.236v15" />
					</svg>
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

	/* prevent button from stretching */
	> a[role="button"] {
		flex-shrink: 0;
		padding: 0.25rem 0.4rem;
		min-width: auto;
	}

	/* text block can wrap */
	> div {
		flex: 1;
		min-width: 0; // important for long Japanese text
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
