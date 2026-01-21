import { mountSuspended } from "@nuxt/test-utils/runtime";
import { flushPromises } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import AddressForm from "../../app/components/AddressForm.vue";
import Button from "../../app/components/Button.vue";
import { useAddressStore } from "../../app/stores/addresses";

// Mock the store module
vi.mock("../../app/stores/addresses", () => ({
	useAddressStore: vi.fn(),
}));

// Import the mocked function after mocking

const mockUseAddressStore = vi.mocked(useAddressStore);

describe("AddressForm.vue", () => {
	let fetchPostalCode: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		vi.resetAllMocks();
		// Set up the mock before mounting to ensure it's available when the component is created
		fetchPostalCode = vi.fn().mockResolvedValue(undefined);
		mockUseAddressStore.mockReturnValue({ fetchPostalCode });
	});

	const mountForm = async (
		fetchImpl?: (postalCode: string) => Promise<void>
	) => {
		// If a custom implementation is provided, update the mock
		if (fetchImpl) {
			fetchPostalCode = vi.fn(fetchImpl);
			mockUseAddressStore.mockReturnValue({ fetchPostalCode });
		}

		return {
			wrapper: await mountSuspended(AddressForm, {
				global: {
					components: { Button },
				},
			}),
			fetchPostalCode,
		};
	};

	it("validates and shows error for invalid characters", async () => {
		const { wrapper } = await mountForm();

		const input = wrapper.get('input[aria-label="postal-code"]');
		await input.setValue("abc");
		await wrapper.get("form").trigger("submit");
		await nextTick();

		const error = wrapper.get("#postal-code-error");
		expect(error.text()).toContain(
			"半角数字のみまたは半角数字とハイフンのみで"
		);

		// aria-invalid propagated
		expect(wrapper.get("fieldset").attributes("aria-invalid")).toBe("true");
		expect(input.attributes("aria-invalid")).toBe("true");
	});

	it("validates and shows error for wrong format (length)", async () => {
		const { wrapper } = await mountForm();
		const input = wrapper.get('input[aria-label="postal-code"]');
		await input.setValue("1234");
		await wrapper.get("form").trigger("submit");
		await nextTick();

		const error = wrapper.get("#postal-code-error");
		expect(error.text()).toContain("ハイフンありの8桁かハイフンなしの7桁");
	});

	it("submits valid postal code and clears input", async () => {
		const { wrapper, fetchPostalCode } = await mountForm();
		const input = wrapper.get('input[aria-label="postal-code"]');

		await input.setValue("123-4567");
		await wrapper.get("form").trigger("submit");
		await flushPromises();

		expect(fetchPostalCode).toHaveBeenCalledTimes(1);
		expect(fetchPostalCode).toHaveBeenCalledWith("123-4567");
		// cleared input
		expect((input.element as HTMLInputElement).value).toBe("");
		// no error message
		expect(wrapper.find("#postal-code-error").exists()).toBe(false);
	});

	it("shows error when fetch fails", async () => {
		const failingFetch = vi.fn().mockRejectedValue(new Error("not found"));
		const { wrapper } = await mountForm(failingFetch);
		const input = wrapper.get('input[aria-label="postal-code"]');

		await input.setValue("123-4567");
		await wrapper.get("form").trigger("submit");
		await flushPromises();

		expect(wrapper.get("#postal-code-error").text()).toContain(
			"郵便番号が存在しません"
		);
	});
});
