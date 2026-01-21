<script setup lang="ts">
import { ref } from "vue";

const { fetchPostalCode } = useAddressStore();

const postalCode = defineModel<string>();
const errorMessage = ref<string | null>(null);

const validatePostalCode = () => {
	errorMessage.value = null;

	// Check for invalid characters
	if (!/^[0-9-]+$/.test(postalCode.value || "")) {
		errorMessage.value =
			"Please enter the postal code using only half-width numbers or half-width numbers and a hyphen.";
		return false;
	}

	// Check for correct format
	if (
		!/^\d{3}-\d{4}$/.test(postalCode.value || "") &&
		!/^\d{7}$/.test(postalCode.value || "")
	) {
		errorMessage.value =
			"Please enter a postal code in either 8 digits with a hyphen or 7 digits without a hyphen.";
		return false;
	}

	return true;
};

const handleSubmit = async () => {
	if (!validatePostalCode()) {
		return;
	}
	try {
		await fetchPostalCode(postalCode.value!);
	} catch {
		errorMessage.value = "The postal code does not exist.";
	}
};
</script>

<template>
	<div>
		<form @submit.prevent="handleSubmit">
			<fieldset role="group" :aria-invalid="!!errorMessage">
				<input
					v-model="postalCode"
					type="text"
					name="postalCode"
					placeholder="郵便番号を入力してください。"
					aria-label="postal-code"
					:aria-invalid="!!errorMessage"
					aria-describedby="postal-code-error"
					maxlength="8"
				/>
				<Button type="submit" label="Search" />
			</fieldset>

			<small id="postal-code-error" v-if="errorMessage">
				{{ errorMessage }}
			</small>
		</form>
	</div>
</template>
