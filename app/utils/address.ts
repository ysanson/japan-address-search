import type { Address, ApiResponse, PostalCodeAddresses } from "@/types/apiResponse";

/**
 * Type guard to check if an object is a valid Address
 */
export function isAddress(obj: unknown): obj is Address {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	const address = obj as Record<string, unknown>;

	return (
		typeof address.address1 === "string" &&
		typeof address.address2 === "string" &&
		typeof address.address3 === "string" &&
		typeof address.kana1 === "string" &&
		typeof address.kana2 === "string" &&
		typeof address.kana3 === "string" &&
		typeof address.prefcode === "string" &&
		typeof address.zipcode === "string"
	);
}

/**
 * Type guard to check if an object is a valid ApiResponse
 */
export function isApiResponse(obj: unknown): obj is ApiResponse {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}

	const response = obj as Record<string, unknown>;

	// status is required
	if (typeof response.status !== "number") {
		return false;
	}

	// message is optional
	if (response.message !== undefined && typeof response.message !== "string") {
		return false;
	}

	// results is optional, but if present must be an array of addresses or null
	if (response.results !== undefined && response.results !== null) {
		if (!Array.isArray(response.results)) {
			return false;
		}
		return response.results.every(isAddress);
	}

	return true;
}

/**
 * Formats a full address string from an Address object
 */
export function formatFullAddress(address: Address): string {
	return `${address.address1}${address.address2}${address.address3}`;
}

/**
 * Formats a full kana address string from an Address object
 */
export function formatFullKana(address: Address): string {
	return `${address.kana1}${address.kana2}${address.kana3}`;
}

/**
 * Checks if an address array is empty or undefined
 */
export function hasAddresses(
	addresses: PostalCodeAddresses | undefined
): addresses is PostalCodeAddresses {
	return addresses !== undefined && addresses.length > 0;
}

/**
 * Gets the prefecture name from an address
 */
export function getPrefectureName(address: Address): string {
	return address.address1;
}

/**
 * Formats a postal code for display (adds hyphen if not present)
 */
export function formatZipcode(zipcode: string): string {
	if (zipcode.includes("-")) {
		return zipcode;
	}
	if (zipcode.length === 7) {
		return `${zipcode.slice(0, 3)}-${zipcode.slice(3)}`;
	}
	return zipcode;
}
