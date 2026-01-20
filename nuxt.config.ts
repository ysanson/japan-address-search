import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
	compatibilityDate: "2025-07-15",
	devtools: { enabled: true },
	// css: ["~/assets/css/tailwind.css"],
	css: ["~/assets/css/tailwind.css"],
	ssr: false,
	vite: {
		plugins: [tailwindcss()],
	},
	modules: ["@nuxt/eslint", "@nuxt/test-utils", "shadcn-nuxt"],

	shadcn: {
		prefix: "",
		componentDir: "~/app/components/ui",
	},
});
