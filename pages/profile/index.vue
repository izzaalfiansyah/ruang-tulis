<script lang="ts" setup>
import type { User } from "~/entities/user.type";
import { appStore } from "~/store/app.store";
import { authStore } from "~/store/auth.store";
import { formStore } from "~/store/form.store";
import z from "zod";
import { UserRepository } from "~/repository/user.repository";
import { showToast } from "~/utils/notification";

const auth = authStore();
const user = ref<User | undefined>({ ...auth.user } as User);

watch(
  () => auth.user,
  () => {
    user.value = { ...auth.user } as User;
  }
);

appStore().seoMeta({
  title: "Profil Saya",
});

const form = formStore();
form.setSchema(
  z
    .object({
      email: z.string().email(),
      name: z.string().min(5),
      phone: z.string().min(8),
      bio: z.string().min(5).optional(),
    })
    .required()
);

async function handleSubmit() {
  if (form.validate(user.value!)) {
    try {
      const result = await UserRepository.update(user.value!);

      if (result) {
        auth.setUser(user.value!);
      }

      showToast("Berhasil mengedit profil", { isSuccess: true });
    } catch (e) {
      showToast(parseError(e));
    }
  }
}
</script>

<template>
  <div class="py-10 main-container">
    <div class="text-4xl font-bold text-primary font-tage">Profil Saya</div>
    <template v-if="user">
      <form @submit.prevent="handleSubmit" class="mt-10">
        <div class="mb-3">
          <div class="mb-1 text-sm text-gray-500">Email</div>
          <TextField
            v-model="user.email"
            placeholder="Email"
            disabled
            class="disabled:bg-gray-100 dark:disabled:bg-gray-800 max-w-full"
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
          <div class="mb-1 text-sm text-gray-500">Nomor Telepon</div>
          <TextField
            v-model="user.phone"
            :error="form.errors?.phone"
            placeholder="Masukkan Nomor Telepon"
            type="tel"
          ></TextField>
        </div>
        <div class="mb-3">
          <div class="mb-1 text-sm text-gray-500">Bio</div>
          <textarea
            rows="3"
            class="w-full bg-transparent border focus:ring-2 focus:ring-primary transition outline-none p-3 rounded resize-none"
            :class="{ 'ring-2 ring-red-500': !!form.errors?.bio }"
            v-model="user.bio"
          ></textarea>
          <div class="mt-1 text-sm text-red-500" v-if="form.errors?.bio">
            {{ form.errors?.bio }}
          </div>
        </div>
        <button
          class="bg-primary px-5 text-sm uppercase font-semibold text-white py-2 rounded"
        >
          Simpan Profil
        </button>
      </form>
    </template>
  </div>
</template>
