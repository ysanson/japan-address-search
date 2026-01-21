<script setup lang="ts">
import { ref, computed } from "vue";

const { addresses } = storeToRefs(useAddressStore());

const ITEMS_PER_PAGE = 3;

const currentPage = ref(0);

// Pagination math
const pageCount = computed(() =>
	Math.ceil(addresses.value.length / ITEMS_PER_PAGE)
);

const isFirst = computed(() => currentPage.value === 0);
const isLast = computed(() => currentPage.value === pageCount.value - 1);

// Navigation
const next = () => {
	if (!isLast.value) currentPage.value++;
};

const prev = () => {
	if (!isFirst.value) currentPage.value--;
};

const goTo = (page: number) => {
	currentPage.value = page;
};

/* ------------------
   Drag / Swipe
------------------ */

const startX = ref(0);
const deltaX = ref(0);
const isDragging = ref(false);

const onPointerDown = (e: PointerEvent) => {
	startX.value = e.clientX;
	isDragging.value = true;
};

const onPointerMove = (e: PointerEvent) => {
	if (!isDragging.value) return;
	deltaX.value = e.clientX - startX.value;
};

const onPointerUp = () => {
	if (!isDragging.value) return;

	const threshold = 80;

	if (deltaX.value > threshold && !isFirst.value) {
		prev();
	} else if (deltaX.value < -threshold && !isLast.value) {
		next();
	}

	deltaX.value = 0;
	isDragging.value = false;
};
</script>
<template>
	<section class="carousel" aria-roledescription="carousel">
		<div
			class="carousel__viewport"
			ref="viewport"
			@pointerdown="onPointerDown"
			@pointermove="onPointerMove"
			@pointerup="onPointerUp"
			@pointerleave="onPointerUp"
			:style="{ '--page': currentPage }"
		>
			<div class="carousel__track">
				<AddressCard
					class="pico-background-grey-150"
					v-for="(addr, i) in addresses.toReversed()"
					is-history
					:key="i"
					:addresses="addr"
				/>
			</div>
		</div>

		<nav class="carousel__controls">
			<button @click="prev" :disabled="isFirst" aria-label="Previous">‹</button>
			<div class="carousel__pagination">
				<button
					v-for="page in pageCount"
					:key="page"
					@click="goTo(page - 1)"
					:aria-current="currentPage === page - 1"
				/>
			</div>

			<button @click="next" :disabled="isLast" aria-label="Next">›</button>
		</nav>
	</section>
</template>
<style lang="scss" scoped>
.carousel {
	--gap: 1rem;

	&__viewport {
		overflow: hidden;
		touch-action: pan-y;
		padding-top: 2rem;
		padding-bottom: 2rem;
	}

	&__track {
		display: grid;
		gap: var(--gap);
		transition: transform 0.4s ease;
	}

	@media (max-width: 767px) {
		&__track {
			grid-auto-flow: column;
			grid-auto-columns: 100%;
			grid-template-rows: repeat(3, auto);
			transform: translateX(calc(-100% * var(--page)));
		}
		.carousel__viewport {
			align-self: stretch;
		}
	}

	@media (min-width: 768px) {
		&__track {
			grid-auto-flow: column;
			grid-auto-columns: calc((100% - 2 * var(--gap)) / 3);
			transform: translateX(calc(-100% * var(--page)));
		}
	}

	&__controls {
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		margin-top: 1rem;
		gap: 1rem;
	}

	&__pagination {
		display: flex;
		justify-content: center;
		gap: 0.5rem;

		button {
			width: 0.5rem;
			height: 0.5rem;
			padding: 0;
			border-radius: 50%;
			opacity: 0.4;

			&[aria-current="true"] {
				opacity: 1;
			}
		}
	}
}
</style>
