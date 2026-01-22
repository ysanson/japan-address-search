import { describe, expect, it } from "vitest";
import type { Address } from "../../../app/types/apiResponse";
import { formatFullAddress, formatFullKana } from "../../../app/utils/address";

describe("address utilities", () => {
	const validAddress: Address = {
		address1: "東京都",
		address2: "千代田区",
		address3: "丸の内",
		kana1: "ﾄｳｷｮｳﾄ",
		kana2: "ﾁﾖﾀﾞｸ",
		kana3: "ﾏﾙﾉｳﾁ",
		prefcode: "13",
		zipcode: "1000001",
	};

	describe("formatFullAddress", () => {
		it("should concatenate address parts", () => {
			expect(formatFullAddress(validAddress)).toBe("東京都千代田区丸の内");
		});

		it("should handle empty address parts", () => {
			const emptyAddress: Address = {
				...validAddress,
				address3: "",
			};
			expect(formatFullAddress(emptyAddress)).toBe("東京都千代田区");
		});
	});

	describe("formatFullKana", () => {
		it("should concatenate kana parts", () => {
			expect(formatFullKana(validAddress)).toBe(
				"トウキョウトチヨダクマルノウチ"
			);
		});

		it("should handle empty kana parts", () => {
			const emptyKana: Address = {
				...validAddress,
				kana3: "",
			};
			expect(formatFullKana(emptyKana)).toBe("トウキョウトチヨダク");
		});
	});
});
