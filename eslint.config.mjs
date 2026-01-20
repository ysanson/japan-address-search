// @ts-check
import prettier from "eslint-config-prettier";
import { existsSync } from "node:fs";

const eslintConfigPath = "./.nuxt/eslint.config.mjs";

async function getConfig() {
	// Custom rules override
	const customRules = {
		rules: {
			"vue/require-default-prop": "off",
			"vue/multi-word-component-names": "off",
			"vue/html-end-tags": "off",
			"vue/no-parsing-error": "off",
		},
	};

	// Only import Nuxt ESLint config if it exists
	if (existsSync(eslintConfigPath)) {
		try {
			const withNuxt = (await import(eslintConfigPath)).default;
			return withNuxt(
				customRules,
				// Prettier must be last to override other configs
				prettier
			);
		} catch (error) {
			// Fallback if import fails
			console.error("Error importing Nuxt ESLint config:", error);
			return [
				{
					ignores: [".nuxt/**", "dist/**", ".output/**"],
				},
				customRules,
				prettier,
			];
		}
	} else {
		// Fallback config if .nuxt is not generated yet
		return [
			{
				ignores: [".nuxt/**", "dist/**", ".output/**"],
			},
			customRules,
			prettier,
		];
	}
}

export default getConfig();
