<script lang="ts" setup>
import z from "zod";
import type { User } from "~/entities/user.type";
import { AuthRepository } from "~/repository/auth.repository";
import { authStore } from "~/store/auth.store";
import { formStore } from "~/store/form.store";

const auth = authStore();
const form = formStore();

const isLoading = ref(false);

form.setSchema(
  z
    .object({
      email: z.string().email(),
      password: z.string().min(8),
    })
    .required({
      email: true,
      password: true,
    })
);

const request = ref({
  email: "",
  password: "",
});

async function handleSubmit() {
  isLoading.value = true;
  if (form.validate(request.value)) {
    try {
      const result = await AuthRepository.login(request.value);

      auth.setUser(result as User);
      useRouter().replace("/");
    } catch (e) {
      form.setError("email", parseError(e));
    }
  }
  isLoading.value = false;
}
</script>

<template>
  <div class="main-container min-h-[80vh] flex items-center justify-center">
    <form @submit.prevent="handleSubmit" class="max-w-full w-[360px]">
      <div class="text-3xl font-bold text-primary font-tage">Login</div>
      <div class="mt-1 text-sm mb-5">
        Jelajah tuangan pikiran di RuangTulis.
      </div>
      <TextField
        type="email"
        v-model="request.email"
        :error="form.errors?.email"
        placeholder="Email Kamu"
      ></TextField>
      <TextField
        type="password"
        v-model="request.password"
        placeholder="Password"
        :error="form.errors?.password"
        class="mt-2"
      ></TextField>
      <div class="mt-10">
        <button
          type="submit"
          class="bg-primary w-full rounded px-4 py-1 text-white outline-none disabled:bg-primary/70"
          :disabled="isLoading"
        >
          {{ isLoading ? "Memuat..." : "Masuk" }}
        </button>
      </div>
    </form>
  </div>
</template>
