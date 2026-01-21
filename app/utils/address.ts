import type { Address } from "@/types/apiResponse";

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
