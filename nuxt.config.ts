// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	css: ["~/assets/scss/main.scss"],
	ssr: false,
	modules: [
		"@nuxt/eslint",
		"@nuxt/test-utils",
		"@pinia/nuxt",
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
