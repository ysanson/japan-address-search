/**
 * Validation utilities for postal codes
 */

export interface ValidationResult {
	isValid: boolean;
	error?: string;
}

/**
 * Validates a Japanese postal code
 * Accepts formats: 123-4567 (with hyphen) or 1234567 (without hyphen)
 */
export function validatePostalCode(postalCode: string): ValidationResult {
	if (!postalCode || postalCode.trim() === "") {
		return {
			isValid: false,
			error: "郵便番号を入力してください。",
		};
	}

	// Check for invalid characters (only digits and hyphen allowed)
	if (!/^[0-9-]+$/.test(postalCode)) {
		return {
			isValid: false,
			error:
				"郵便番号は半角数字のみまたは半角数字とハイフンのみで入力してください。",
		};
	}

	// Check for correct format (123-4567 or 1234567)
	const withHyphen = /^\d{3}-\d{4}$/;
	const withoutHyphen = /^\d{7}$/;

	if (!withHyphen.test(postalCode) && !withoutHyphen.test(postalCode)) {
		return {
			isValid: false,
			error:
				"郵便番号は半角数字でハイフンありの8桁かハイフンなしの7桁で入力してください。",
		};
	}

	return { isValid: true };
}

/**
 * Normalizes a postal code to the format without hyphen (1234567)
 */
export function normalizePostalCode(postalCode: string): string {
	return postalCode.replace(/-/g, "");
}

/**
 * Formats a postal code to the standard format with hyphen (123-4567)
 */
export function formatPostalCode(postalCode: string): string {
	const normalized = normalizePostalCode(postalCode);
	if (normalized.length === 7) {
		return `${normalized.slice(0, 3)}-${normalized.slice(3)}`;
	}
	return postalCode;
}
