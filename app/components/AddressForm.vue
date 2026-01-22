<script setup lang="ts">
import { ref } from "vue";
import { validatePostalCode } from "@/utils/postalCode";
import { NoResultsError } from "@/stores/addresses";

const { fetchPostalCode } = useAddressStore();

const postalCode = defineModel<string>();
const errorMessage = ref<string | null>(null);
const loading = ref(false);

const handleSubmit = async () => {
	const validation = validatePostalCode(postalCode.value ?? "");
	if (!validation.isValid) {
		errorMessage.value = validation.error ?? null;
		return;
	}
	errorMessage.value = null;
	loading.value = true;
	try {
		await fetchPostalCode(postalCode.value!);
		postalCode.value = "";
	} catch (error) {
		if (error instanceof NoResultsError) {
			errorMessage.value = "郵便番号が存在しません。";
		} else {
			errorMessage.value = "エラーが発生しました。";
		}
	} finally {
		loading.value = false;
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
					inputmode="numeric"
					autocomplete="postal-code"
				/>
				<Button
					type="submit"
					label="検索"
					:disabled="!postalCode || postalCode?.length === 0"
					:loading="loading"
				/>
			</fieldset>

			<small id="postal-code-error" v-if="errorMessage">
				{{ errorMessage }}
			</small>
		</form>
	</div>
</template>
