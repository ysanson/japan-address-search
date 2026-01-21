import withNuxt from "./.nuxt/eslint.config.mjs";

import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default withNuxt([
	{
		plugins: {
			prettier: eslintPluginPrettier,
		},
		rules: {
			...eslintConfigPrettier.rules,
			...eslintPluginPrettierRecommended.rules,
			"vue/multi-word-component-names": "off",
			"vue/attributes-order": "off",
		},
		ignores: [
			".nuxt/*",
			".nuxt/*/**",
			".vscode/*",
			".vscode/*/**",
			".output/*",
			".output/*/**",
			"node_modules",
			"pnpm-lock.yaml",
			"yarn.lock",
			"package-lock.json",
		],
	},
]);
