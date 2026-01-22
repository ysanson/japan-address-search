import type { ApiResponse, PostalCodeAddresses } from "@/types/apiResponse";

export class NoResultsError extends Error {
	constructor(postalCode: string) {
		super(`No address found for postal code ${postalCode}`);
		this.name = "NoResultsError";
	}
}

export class ApiCommunicationError extends Error {
	constructor(
		message: string,
		public originalError?: unknown
	) {
		super(message);
		this.name = "ApiCommunicationError";
	}
}

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
				throw new ApiCommunicationError(
					`Failed to communicate with the API: ${error.value.message || "Unknown error"}`,
					error.value
				);
			}

			if (!data.value || data.value.status !== 200) {
				throw new ApiCommunicationError("No data received from the API");
			}

			if (data.value.status === 200 && data.value.results === null) {
				throw new NoResultsError(postalCode);
			}

			this.showFirstResult = true;
			this.addresses.push(data.value.results ?? []);

			return { data, pending, error };
		},
	},
});
