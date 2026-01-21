import { mountSuspended } from "@nuxt/test-utils/runtime";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h, nextTick, ref } from "vue";
import Carousel from "../../app/components/Carousel.vue";

import type { Address, PostalCodeAddresses } from "../../app/types/apiResponse";
// Import the mocked functions after mocking
import { storeToRefs } from "pinia";
import { useAddressStore } from "../../app/stores/addresses";

// Mock the store module
vi.mock("../../app/stores/addresses", () => ({
	useAddressStore: vi.fn(),
}));

// Mock storeToRefs from pinia
vi.mock("pinia", async () => {
	const actual = await vi.importActual("pinia");
	return {
		...actual,
		storeToRefs: vi.fn(),
	};
});

const mockUseAddressStore = vi.mocked(useAddressStore);
const mockStoreToRefs = vi.mocked(storeToRefs);

describe("Carousel.vue", () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	const makeAddress = (zipcode: string, suffix: string): Address => ({
		address1: "東京都",
		address2: "千代田区",
		address3: `丸の内${suffix}`,
		kana1: "ﾄｳｷｮｳﾄ",
		kana2: "ﾁﾖﾀﾞｸ",
		kana3: "ﾏﾙﾉｳﾁ",
		prefcode: "13",
		zipcode,
	});

	const makeGroup = (zip: string): PostalCodeAddresses => [
		makeAddress(zip, "1-1"),
	];

	it("renders pages and navigates with controls", async () => {
		// 4 groups -> pageCount = ceil(4 / 3) = 2
		const addressesRef = ref<PostalCodeAddresses[]>([
			makeGroup("1000001"),
			makeGroup("1000002"),
			makeGroup("1000003"),
			makeGroup("1000004"),
		]);

		// Provide mocked store and storeToRefs used in the SFC
		mockUseAddressStore.mockReturnValue({ addresses: addressesRef });
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		mockStoreToRefs.mockImplementation((store: any) => ({
			addresses: store.addresses,
		}));

		const wrapper = await mountSuspended(Carousel, {
			global: {
				stubs: {
					// We don't need AddressCard internals here
					AddressCard: defineComponent({
						render() {
							return h("div", { "data-test": "card" });
						},
					}),
				},
			},
		});

		// Page buttons reflect page count
		const pageDots = wrapper.findAll(".carousel__pagination button");
		expect(pageDots.length).toBe(2);

		// Initially on first page
		const prev = wrapper.get('button[aria-label="Previous"]');
		const next = wrapper.get('button[aria-label="Next"]');
		expect(prev.attributes().disabled).toBeDefined();
		expect(next.attributes().disabled).toBeUndefined();

		// Go to page 2
		await pageDots[1]!.trigger("click");
		await nextTick();
		expect(pageDots[1]!.attributes("aria-current")).toBe("true");

		// Next should now be disabled on last page
		expect(next.attributes().disabled).toBeDefined();
		// Prev should be enabled
		expect(prev.attributes().disabled).toBeUndefined();

		// Navigate back using prev
		await prev.trigger("click");
		await nextTick();
		expect(pageDots[0]!.attributes("aria-current")).toBe("true");
	});
});
