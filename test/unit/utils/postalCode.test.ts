import { describe, expect, it } from "vitest";
import {
	formatPostalCode,
	normalizePostalCode,
	validatePostalCode,
} from "../../../app/utils/postalCode";

describe("postalCode utilities", () => {
	describe("validatePostalCode", () => {
		describe("valid postal codes", () => {
			it("should accept postal code with hyphen (123-4567)", () => {
				const result = validatePostalCode("123-4567");
				expect(result.isValid).toBe(true);
				expect(result.error).toBeUndefined();
			});

			it("should accept postal code without hyphen (1234567)", () => {
				const result = validatePostalCode("1234567");
				expect(result.isValid).toBe(true);
				expect(result.error).toBeUndefined();
			});

			it("should accept real Tokyo postal code (100-0001)", () => {
				const result = validatePostalCode("100-0001");
				expect(result.isValid).toBe(true);
			});

			it("should accept real Osaka postal code (5300001)", () => {
				const result = validatePostalCode("5300001");
				expect(result.isValid).toBe(true);
			});
		});

		describe("invalid postal codes", () => {
			it("should reject empty string", () => {
				const result = validatePostalCode("");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("入力してください");
			});

			it("should reject whitespace only", () => {
				const result = validatePostalCode("   ");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("入力してください");
			});

			it("should reject postal code with letters", () => {
				const result = validatePostalCode("abc-defg");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("半角数字のみまたは半角数字とハイフンのみで");
			});

			it("should reject postal code with special characters", () => {
				const result = validatePostalCode("123@4567");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("半角数字のみまたは半角数字とハイフンのみで");
			});

			it("should reject postal code with spaces", () => {
				const result = validatePostalCode("123 4567");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("半角数字のみまたは半角数字とハイフンのみで");
			});

			it("should reject too short postal code", () => {
				const result = validatePostalCode("123");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("ハイフンありの8桁かハイフンなしの7桁");
			});

			it("should reject too long postal code", () => {
				const result = validatePostalCode("12345678");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("ハイフンありの8桁かハイフンなしの7桁");
			});

			it("should reject postal code with wrong hyphen position", () => {
				const result = validatePostalCode("12-34567");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("ハイフンありの8桁かハイフンなしの7桁");
			});

			it("should reject postal code with multiple hyphens", () => {
				const result = validatePostalCode("1-2-3-4-5-6-7");
				expect(result.isValid).toBe(false);
				expect(result.error).toContain("ハイフンありの8桁かハイフンなしの7桁");
			});
		});
	});

	describe("normalizePostalCode", () => {
		it("should remove hyphen from postal code", () => {
			expect(normalizePostalCode("123-4567")).toBe("1234567");
		});

		it("should return unchanged if no hyphen", () => {
			expect(normalizePostalCode("1234567")).toBe("1234567");
		});

		it("should remove multiple hyphens", () => {
			expect(normalizePostalCode("1-2-3-4-5-6-7")).toBe("1234567");
		});

		it("should handle empty string", () => {
			expect(normalizePostalCode("")).toBe("");
		});
	});

	describe("formatPostalCode", () => {
		it("should add hyphen to 7-digit postal code", () => {
			expect(formatPostalCode("1234567")).toBe("123-4567");
		});

		it("should return unchanged if already formatted", () => {
			expect(formatPostalCode("123-4567")).toBe("123-4567");
		});

		it("should handle postal code with wrong format", () => {
			expect(formatPostalCode("12345")).toBe("12345");
		});

		it("should normalize then format", () => {
			expect(formatPostalCode("1-2-3-4-5-6-7")).toBe("123-4567");
		});

		it("should handle empty string", () => {
			expect(formatPostalCode("")).toBe("");
		});
	});
});
