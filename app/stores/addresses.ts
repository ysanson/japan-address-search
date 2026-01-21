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
			const { data, pending, error } = await useApi<ApiResponse>("/search", {
				params: { zipcode: postalCode },
				responseType: "json",
			});
			if (error.value) {
				throw createError(error.value);
			}
			if (data.value) {
				if (data.value.status !== 200 || data.value.results === null) {
					throw new Error(`No address found for postal code ${postalCode}`);
				}
				this.showFirstResult = true;
				this.addresses.push(data.value.results!);
			}
			return { data, pending, error };
		},
	},
});
