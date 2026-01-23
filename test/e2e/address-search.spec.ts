import { expect, test } from "@playwright/test";

test.describe("Address Search - Nominal Case", () => {
	test("should search for a valid postal code (174-0071) and display results", async ({
		page,
	}) => {
		await page.goto("/");

		await expect(page.locator("h1")).toHaveText("住所検索");

		const postalCodeInput = page.locator('input[name="postalCode"]');
		await expect(postalCodeInput).toBeVisible();

		await postalCodeInput.fill("174-0071");

		const searchButton = page.locator('button[type="submit"]');
		await expect(searchButton).toBeEnabled();
		await searchButton.click();

		const addressCard = page.locator(".address-card");
		await expect(addressCard).toBeVisible({ timeout: 10000 });

		await expect(addressCard).toContainText(
			"郵便番号: 1740071東京都板橋区常盤台トウキョウトイタバシクトキワダイ"
		);

		await expect(postalCodeInput).toHaveValue("");

		const historyHeading = page.locator("h2").filter({ hasText: "検索履歴" });
		await expect(historyHeading).toBeVisible();

		const carousel = page.locator('[class*="carousel"]').first();
		await expect(carousel).toBeVisible();
	});

	test("should handle postal code without hyphen (1740071)", async ({
		page,
	}) => {
		await page.goto("/");

		const postalCodeInput = page.locator('input[name="postalCode"]');

		await postalCodeInput.fill("1740071");

		const searchButton = page.locator('button[type="submit"]');
		await searchButton.click();

		const addressCard = page.locator(".address-card");
		await expect(addressCard).toBeVisible({ timeout: 10000 });

		await expect(addressCard).toContainText(
			"郵便番号: 1740071東京都板橋区常盤台トウキョウトイタバシクトキワダイ"
		);
	});

	test("should display error for invalid postal code", async ({ page }) => {
		await page.goto("/");

		const postalCodeInput = page.locator('input[name="postalCode"]');

		await postalCodeInput.fill("invalid");

		const searchButton = page.locator('button[type="submit"]');
		await searchButton.click();

		const errorMessage = page.locator("#postal-code-error");
		await expect(errorMessage).toBeVisible();
		await expect(errorMessage).not.toBeEmpty();
	});

	test("should disable search button when input is empty", async ({ page }) => {
		await page.goto("/");

		const searchButton = page.locator('button[type="submit"]');

		await expect(searchButton).toBeDisabled();

		const postalCodeInput = page.locator('input[name="postalCode"]');
		await postalCodeInput.fill("174-0071");

		await expect(searchButton).toBeEnabled();

		await postalCodeInput.clear();

		await expect(searchButton).toBeDisabled();
	});
});
