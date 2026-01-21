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
			"郵便番号は半角数字のみまたは半角数字とハイフンのみで入力してください。";
		return false;
	}

	// Check for correct format
	if (
		!/^\d{3}-\d{4}$/.test(postalCode.value || "") &&
		!/^\d{7}$/.test(postalCode.value || "")
	) {
		errorMessage.value =
			"郵便番号は半角数字でハイフンありの8桁かハイフンなしの7桁で入力してください。";
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
		postalCode.value = "";
	} catch {
		errorMessage.value = "郵便番号が存在しません。";
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
				<Button
					type="submit"
					label="検索"
					:disabled="!postalCode || postalCode?.length === 0"
				/>
			</fieldset>

			<small id="postal-code-error" v-if="errorMessage">
				{{ errorMessage }}
			</small>
		</form>
	</div>
</template>
