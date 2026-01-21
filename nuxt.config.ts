// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/scss/main.scss"],
	ssr: false,
	runtimeConfig: {
		public: {
			apiUrl: process.env.NUXT_PUBLIC_API_URL,
		},
	},
	modules: [
		"@nuxt/eslint",
		"@nuxt/test-utils",
		["@pinia/nuxt", { autoImports: ["defineStore"] }],
		"pinia-plugin-persistedstate/nuxt",
		[
			"@nuxt/fonts",
			{
				families: [
					{
						name: "Inter",
						provider: "google",
					},
				],
			},
		],
	],
});
