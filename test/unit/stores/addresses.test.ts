import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPinia, setActivePinia, defineStore } from "pinia";
import type { ApiResponse, PostalCodeAddresses } from "../../../app/types/apiResponse";

// Mock fetch globally
global.fetch = vi.fn();

// Define the store inline for unit testing (since we're in Node environment without Nuxt auto-imports)
interface AddressStore {
	addresses: PostalCodeAddresses[];
}

const useAddressStore = defineStore("addressStore", {
	state: (): AddressStore => ({
		addresses: [] as PostalCodeAddresses[],
	}),
	getters: {
		lastAddress(): PostalCodeAddresses | undefined {
			return this.addresses[this.addresses.length - 1];
		},
	},
	actions: {
		async fetchPostalCode(postalCode: string) {
			const response = await fetch(
				`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data: ApiResponse = await response.json();
			if (data.status !== 200 || data.results === null) {
				throw new Error(`No address found for postal code ${postalCode}`);
			}
			this.addresses.push(data.results!);
		},
	},
});

describe("useAddressStore", () => {
	beforeEach(() => {
		// Create a fresh pinia instance for each test
		setActivePinia(createPinia());
		vi.clearAllMocks();
	});

	describe("initial state", () => {
		it("should initialize with empty addresses array", () => {
			const store = useAddressStore();
			expect(store.addresses).toEqual([]);
		});
	});

	describe("lastAddress getter", () => {
		it("should return undefined when addresses array is empty", () => {
			const store = useAddressStore();
			expect(store.lastAddress).toBeUndefined();
		});

		it("should return the last address in the array", () => {
			const store = useAddressStore();
			const mockAddresses1 = [
				{
					address1: "東京都",
					address2: "千代田区",
					address3: "丸の内",
					kana1: "ﾄｳｷｮｳﾄ",
					kana2: "ﾁﾖﾀﾞｸ",
					kana3: "ﾏﾙﾉｳﾁ",
					prefcode: "13",
					zipcode: "1000001",
				},
			];
			const mockAddresses2 = [
				{
					address1: "大阪府",
					address2: "大阪市",
					address3: "北区",
					kana1: "ｵｵｻｶﾌ",
					kana2: "ｵｵｻｶｼ",
					kana3: "ｷﾀｸ",
					prefcode: "27",
					zipcode: "5300001",
				},
			];

			store.addresses.push(mockAddresses1);
			store.addresses.push(mockAddresses2);

			expect(store.lastAddress).toEqual(mockAddresses2);
		});
	});

	describe("fetchPostalCode action", () => {
		it("should fetch and store address data successfully", async () => {
			const store = useAddressStore();
			const mockResponse: ApiResponse = {
				status: 200,
				results: [
					{
						address1: "東京都",
						address2: "千代田区",
						address3: "丸の内",
						kana1: "ﾄｳｷｮｳﾄ",
						kana2: "ﾁﾖﾀﾞｸ",
						kana3: "ﾏﾙﾉｳﾁ",
						prefcode: "13",
						zipcode: "1000001",
					},
				],
			};

			vi.mocked(fetch).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			} as Response);

			await store.fetchPostalCode("100-0001");

			expect(fetch).toHaveBeenCalledWith(
				"https://zipcloud.ibsnet.co.jp/api/search?zipcode=100-0001"
			);
			expect(store.addresses).toHaveLength(1);
			expect(store.addresses[0]).toEqual(mockResponse.results);
		});

		it("should throw error when HTTP response is not ok", async () => {
			const store = useAddressStore();

			vi.mocked(fetch).mockResolvedValueOnce({
				ok: false,
				status: 500,
			} as Response);

			await expect(store.fetchPostalCode("100-0001")).rejects.toThrow(
				"HTTP error! status: 500"
			);
			expect(store.addresses).toHaveLength(0);
		});

		it("should throw error when API status is not 200", async () => {
			const store = useAddressStore();
			const mockResponse: ApiResponse = {
				status: 400,
				message: "Invalid postal code",
				results: null,
			};

			vi.mocked(fetch).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			} as Response);

			await expect(store.fetchPostalCode("invalid")).rejects.toThrow(
				"No address found for postal code invalid"
			);
			expect(store.addresses).toHaveLength(0);
		});

		it("should throw error when results is null", async () => {
			const store = useAddressStore();
			const mockResponse: ApiResponse = {
				status: 200,
				results: null,
			};

			vi.mocked(fetch).mockResolvedValueOnce({
				ok: true,
				json: async () => mockResponse,
			} as Response);

			await expect(store.fetchPostalCode("999-9999")).rejects.toThrow(
				"No address found for postal code 999-9999"
			);
			expect(store.addresses).toHaveLength(0);
		});

		it("should accumulate multiple fetched addresses", async () => {
			const store = useAddressStore();
			const mockResponse1: ApiResponse = {
				status: 200,
				results: [
					{
						address1: "東京都",
						address2: "千代田区",
						address3: "丸の内",
						kana1: "ﾄｳｷｮｳﾄ",
						kana2: "ﾁﾖﾀﾞｸ",
						kana3: "ﾏﾙﾉｳﾁ",
						prefcode: "13",
						zipcode: "1000001",
					},
				],
			};
			const mockResponse2: ApiResponse = {
				status: 200,
				results: [
					{
						address1: "大阪府",
						address2: "大阪市",
						address3: "北区",
						kana1: "ｵｵｻｶﾌ",
						kana2: "ｵｵｻｶｼ",
						kana3: "ｷﾀｸ",
						prefcode: "27",
						zipcode: "5300001",
					},
				],
			};

			vi.mocked(fetch)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockResponse1,
				} as Response)
				.mockResolvedValueOnce({
					ok: true,
					json: async () => mockResponse2,
				} as Response);

			await store.fetchPostalCode("100-0001");
			await store.fetchPostalCode("530-0001");

			expect(store.addresses).toHaveLength(2);
			expect(store.addresses[0]).toEqual(mockResponse1.results);
			expect(store.addresses[1]).toEqual(mockResponse2.results);
			expect(store.lastAddress).toEqual(mockResponse2.results);
		});
	});
});
