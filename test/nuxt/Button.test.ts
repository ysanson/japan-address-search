import { mountSuspended } from "@nuxt/test-utils/runtime";
import { describe, expect, it } from "vitest";
import Button from "../../app/components/Button.vue";

describe("Button.vue", () => {
	it("renders label and type", async () => {
		const wrapper = await mountSuspended(Button, {
			props: { type: "submit", label: "検索" },
		});
		expect(wrapper.text()).toBe("検索");
		expect(wrapper.attributes("type")).toBe("submit");
	});

	it("applies color and outline classes", async () => {
		const wrapper = await mountSuspended(Button, {
			props: {
				type: "button",
				label: "Hello",
				color: "secondary",
				outline: true,
			},
		});
		expect(wrapper.classes()).toContain("secondary");
		expect(wrapper.classes()).toContain("outline");
	});

	it("forwards native attributes (disabled)", async () => {
		const wrapper = await mountSuspended(Button, {
			props: { type: "button", label: "Disabled" },
			attrs: { disabled: "" },
		});
		expect(wrapper.attributes().disabled).not.toBeUndefined();
	});
});
