import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import AddressCard from "../../app/components/AddressCard.vue";

import type { Address, PostalCodeAddresses } from "../../app/types/apiResponse";

describe("AddressCard.vue", () => {
	const makeAddress = (overrides: Partial<Address> = {}): Address => ({
		address1: "東京都",
		address2: "千代田区",
		address3: "丸の内",
		kana1: "ﾄｳｷｮｳﾄ",
		kana2: "ﾁﾖﾀﾞｸ",
		kana3: "ﾏﾙﾉｳﾁ",
		prefcode: "13",
		zipcode: "1000001",
		...overrides,
	});

	it("renders zipcode and address contents, with separators between items", async () => {
		const addresses: PostalCodeAddresses = [
			makeAddress({ address3: "丸の内1-1" }),
			makeAddress({ address3: "丸の内1-2" }),
		];

		const wrapper = await mountSuspended(AddressCard, {
			props: { addresses },
		});

		// Header with zipcode
		expect(wrapper.find("header").text()).toContain("郵便番号: 1000001");

		// Body contains both address lines and kana
		expect(wrapper.text()).toContain("東京都千代田区丸の内1-1");
		expect(wrapper.text()).toContain("トウキョウトチヨダクマルノウチ");
		expect(wrapper.text()).toContain("東京都千代田区丸の内1-2");

		// hr separators for all but last
		const hrs = wrapper.findAll("hr");
		expect(hrs.length).toBe(addresses.length - 1);
	});

	it("applies history styles when isHistory is true", async () => {
		const addresses: PostalCodeAddresses = [makeAddress()];
		const wrapper = await mountSuspended(AddressCard, {
			props: { addresses, isHistory: true },
		});

		expect(wrapper.find("article").classes()).toContain(
			"history-card-background"
		);
		expect(wrapper.find("header").classes()).toContain(
			"history-header-background"
		);
	});
});
