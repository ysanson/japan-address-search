import type { ApiResponse, PostalCodeAddresses } from "@/types/apiResponse";

interface AddressStore {
	addresses: PostalCodeAddresses[];
	showFirstResult: boolean;
}

export const useAddressStore = defineStore("addressStore", {
	persist: {
		storage: sessionStorage,
		pick: ["addresses"],
	},
	state: (): AddressStore => ({
		addresses: [] as PostalCodeAddresses[],
		showFirstResult: false,
	}),
	getters: {
		lastAddress(): PostalCodeAddresses | undefined {
			if (!this.showFirstResult) {
				return undefined;
			}
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
			this.showFirstResult = true;
			this.addresses.push(data.results!);
		},
	},
});
