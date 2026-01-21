import type { UseFetchOptions } from "nuxt/app";

export const useApi = <T>(url: string, config?: UseFetchOptions<T>) => {
	const runtimeConfig = useRuntimeConfig();

	return useFetch(url, {
		baseURL: runtimeConfig.public.apiUrl,
		...config,
	});
};
