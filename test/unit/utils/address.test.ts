import { describe, expect, it } from "vitest";
import type { Address, ApiResponse } from "../../../app/types/apiResponse";
import {
	formatFullAddress,
	formatFullKana,
	formatZipcode,
	getPrefectureName,
	hasAddresses,
	isAddress,
	isApiResponse,
} from "../../../app/utils/address";

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

	describe("isAddress", () => {
		it("should return true for valid address object", () => {
			expect(isAddress(validAddress)).toBe(true);
		});

		it("should return false for null", () => {
			expect(isAddress(null)).toBe(false);
		});

		it("should return false for undefined", () => {
			expect(isAddress(undefined)).toBe(false);
		});

		it("should return false for non-object", () => {
			expect(isAddress("not an object")).toBe(false);
			expect(isAddress(123)).toBe(false);
			expect(isAddress(true)).toBe(false);
		});

		it("should return false for object missing required fields", () => {
			const incomplete = {
				address1: "東京都",
				address2: "千代田区",
				// missing other fields
			};
			expect(isAddress(incomplete)).toBe(false);
		});

		it("should return false for object with wrong field types", () => {
			const wrongTypes = {
				...validAddress,
				address1: 123, // should be string
			};
			expect(isAddress(wrongTypes)).toBe(false);
		});

		it("should return false for empty object", () => {
			expect(isAddress({})).toBe(false);
		});
	});

	describe("isApiResponse", () => {
		it("should return true for valid success response", () => {
			const response: ApiResponse = {
				status: 200,
				results: [validAddress],
			};
			expect(isApiResponse(response)).toBe(true);
		});

		it("should return true for valid error response", () => {
			const response: ApiResponse = {
				status: 400,
				message: "Invalid postal code",
				results: null,
			};
			expect(isApiResponse(response)).toBe(true);
		});

		it("should return true for response with only status", () => {
			const response = { status: 200 };
			expect(isApiResponse(response)).toBe(true);
		});

		it("should return false for null", () => {
			expect(isApiResponse(null)).toBe(false);
		});

		it("should return false for object without status", () => {
			const response = { results: [validAddress] };
			expect(isApiResponse(response)).toBe(false);
		});

		it("should return false for object with non-number status", () => {
			const response = { status: "200" };
			expect(isApiResponse(response)).toBe(false);
		});

		it("should return false for object with invalid message type", () => {
			const response = { status: 200, message: 123 };
			expect(isApiResponse(response)).toBe(false);
		});

		it("should return false for object with non-array results", () => {
			const response = { status: 200, results: "not an array" };
			expect(isApiResponse(response)).toBe(false);
		});

		it("should return false for object with invalid address in results", () => {
			const response = {
				status: 200,
				results: [{ invalid: "address" }],
			};
			expect(isApiResponse(response)).toBe(false);
		});
	});

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
			expect(formatFullKana(validAddress)).toBe("ﾄｳｷｮｳﾄﾁﾖﾀﾞｸﾏﾙﾉｳﾁ");
		});

		it("should handle empty kana parts", () => {
			const emptyKana: Address = {
				...validAddress,
				kana3: "",
			};
			expect(formatFullKana(emptyKana)).toBe("ﾄｳｷｮｳﾄﾁﾖﾀﾞｸ");
		});
	});

	describe("hasAddresses", () => {
		it("should return true for non-empty array", () => {
			expect(hasAddresses([validAddress])).toBe(true);
		});

		it("should return false for empty array", () => {
			expect(hasAddresses([])).toBe(false);
		});

		it("should return false for undefined", () => {
			expect(hasAddresses(undefined)).toBe(false);
		});
	});

	describe("getPrefectureName", () => {
		it("should return the prefecture name", () => {
			expect(getPrefectureName(validAddress)).toBe("東京都");
		});

		it("should return address1 field", () => {
			const osakaAddress: Address = {
				...validAddress,
				address1: "大阪府",
			};
			expect(getPrefectureName(osakaAddress)).toBe("大阪府");
		});
	});

	describe("formatZipcode", () => {
		it("should add hyphen to 7-digit zipcode", () => {
			expect(formatZipcode("1000001")).toBe("100-0001");
		});

		it("should return unchanged if already has hyphen", () => {
			expect(formatZipcode("100-0001")).toBe("100-0001");
		});

		it("should return unchanged for invalid length", () => {
			expect(formatZipcode("123")).toBe("123");
		});

		it("should handle empty string", () => {
			expect(formatZipcode("")).toBe("");
		});
	});
});
