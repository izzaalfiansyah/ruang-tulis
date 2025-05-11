<script lang="ts" setup>
import { appStore } from "~/store/app.store";
import { formStore } from "~/store/form.store";
import z from "zod";
import {
  AuthRepository,
  type RegisterParams,
} from "~/repository/auth.repository";
import { authStore } from "~/store/auth.store";

const user = ref<RegisterParams>({
  email: "",
  name: "",
  password: "",
  password_confirm: "",
});
const isLoading = ref(false);

appStore().seoMeta({
  title: "Register",
});

const form = formStore();
form.setSchema(
  z
    .object({
      email: z.string().email(),
      name: z.string().min(5),
      password: z.string().min(8),
      password_confirm: z
        .string()
        .min(8)
        .refine(
          (val) => val === user.value?.password,
          "Password does not match"
        ),
    })
    .required()
);

async function handleSubmit() {
  isLoading.value = true;
  if (form.validate(user.value!)) {
    try {
      const result = await AuthRepository.register(user.value!);

      if (result) {
        authStore().setUser(result);
      }

      showToast("Berhasil mendaftar akun", { isSuccess: true });
      useRouter().replace("/");
    } catch (e) {
      showToast(parseError(e));
    }
  }
  isLoading.value = false;
}

definePageMeta({
  middleware: ["guest-middleware"],
});
</script>

<template>
  <div class="py-10 min-h-[80vh] main-container !w-[600px]">
    <div class="text-3xl font-bold text-primary font-tage">Register</div>
    <div class="mt-1 text-sm">Buat akun baru dan mulai eksplorsi.</div>
    <form @submit.prevent="handleSubmit" class="mt-5">
      <div class="mb-3">
        <div class="mb-1 text-sm text-gray-500">Email</div>
        <TextField
          v-model="user.email"
          placeholder="Email"
          :error="form.errors?.email"
        ></TextField>
      </div>
      <div class="mb-3">
        <div class="mb-1 text-sm text-gray-500">Nama</div>
        <TextField
          v-model="user.name"
          placeholder="Masukkan Nama"
          :error="form.errors?.name"
        ></TextField>
      </div>
      <div class="mb-3">
        <div class="mb-1 text-sm text-gray-500">Password</div>
        <TextField
          type="password"
          v-model="user.password"
          placeholder="Masukkan Password"
          :error="form.errors?.password"
          class="mb-1"
        ></TextField>
        <TextField
          type="password"
          v-model="user.password_confirm"
          placeholder="Masukkan Konfirmasi Password"
          :error="form.errors?.password_confirm"
        ></TextField>
      </div>
      <div class="mt-10">
        <button
          type="submit"
          class="bg-primary w-full rounded px-4 py-1 text-white outline-none disabled:bg-primary/70"
          :disabled="isLoading"
        >
          {{ isLoading ? "Memuat..." : "Daftar Sekarang" }}
        </button>
      </div>
      <div class="mt-10 text-sm text-center">
        Sudah punya akun? login
        <nuxt-link to="/login" class="text-primary">di sini</nuxt-link>
      </div>
    </form>
  </div>
</template>
