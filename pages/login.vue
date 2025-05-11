<script lang="ts" setup>
import z from "zod";
import type { User } from "~/entities/user.type";
import { AuthRepository, type LoginParams } from "~/repository/auth.repository";
import { appStore } from "~/store/app.store";
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
    .required()
);

const request = ref<LoginParams>({
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

async function handleLoginByGoogle() {
  try {
    const result = await AuthRepository.loginByGoogle();

    auth.setUser(result);
    useRouter().replace("/");
  } catch (e) {
    // form.setError("email", parseError(e));
  }
}

definePageMeta({
  middleware: ["guest-middleware"],
});

appStore().seoMeta({
  title: "Login",
});
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
        <button
          type="button"
          class="border w-full px-4 py-1 rounded mt-3 disabled:bg-gray-100 dark:disabled:bg-gray-800 inline-flex items-center justify-center"
          :disabled="isLoading"
          @click="handleLoginByGoogle"
        >
          <img
            src="https://cdn4.iconfinder.com/data/icons/logos-brands-7/512/google_logo-google_icongoogle-512.png"
            alt=""
            class="inline size-4"
          />
          <span class="ml-2">Google</span>
        </button>
      </div>
      <div class="mt-10 text-sm text-center">
        Belum punya akun? register
        <nuxt-link to="/register" class="text-primary">di sini</nuxt-link>
      </div>
    </form>
  </div>
</template>
