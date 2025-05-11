<script lang="ts" setup>
import type { User } from "~/entities/user.type";
import { appStore } from "~/store/app.store";
import { authStore } from "~/store/auth.store";
import { formStore } from "~/store/form.store";
import z from "zod";
import { UserRepository } from "~/repository/user.repository";
import { showToast } from "~/utils/notification";
import { ArrowLeftStartOnRectangleIcon } from "@heroicons/vue/24/outline";
import { AuthRepository } from "~/repository/auth.repository";

const auth = authStore();
const user = ref<User | undefined>({ ...auth.user } as User);
const password = ref({
  password: "",
  password_confirm: "",
});
const showLogoutModal = ref(false);

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
      password: z.string().min(8).optional(),
      password_confirm: z
        .string()
        .min(8)
        .optional()
        .refine(
          (value) => value === password.value.password,
          "Password tidak sama"
        ),
    })
    .required()
);

async function handleSubmit() {
  if (form.validate({ ...user.value!, ...password.value })) {
    try {
      const result = await UserRepository.save(
        user.value!,
        password.value.password
      );

      if (result) {
        auth.setUser(user.value!);
      }

      showToast("Berhasil mengedit profil", { isSuccess: true });
      password.value.password = "";
      password.value.password_confirm = "";
    } catch (e) {
      showToast(parseError(e));
    }
  }
}

async function handleLogout() {
  await AuthRepository.logout();

  auth.setUser();
  showLogoutModal.value = false;

  useRouter().replace("/login");
}

definePageMeta({
  middleware: ["auth-middleware"],
});
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
            placeholder="Masukkan Bio"
          ></textarea>
          <div class="mt-1 text-sm text-red-500" v-if="form.errors?.bio">
            {{ form.errors?.bio }}
          </div>
        </div>
        <div class="mb-3">
          <div class="text-sm text-gray-500">Password</div>
          <div class="text-xs text-gray-400 dark:text-gray-600 mb-1 italic">
            (Isi jika ingin mengganti password anda.)
          </div>
          <TextField
            type="password"
            v-model="password.password"
            placeholder="Masukkan Password"
            :error="form.errors?.password"
            class="mb-1"
          ></TextField>
          <TextField
            type="password"
            v-model="password.password_confirm"
            placeholder="Masukkan Konfirmasi Password"
            :error="form.errors?.password_confirm"
          ></TextField>
        </div>
        <div class="flex items-center justify-between mt-10">
          <button
            class="bg-primary px-5 text-sm uppercase font-semibold text-white py-2 rounded"
            type="submit"
          >
            Simpan Profil
          </button>
          <button
            class="bg-red-500 px-5 text-sm uppercase font-semibold text-white py-2 rounded inline-flex items-center"
            type="button"
            @click="showLogoutModal = true"
          >
            <ArrowLeftStartOnRectangleIcon
              class="mr-2 size-4"
            ></ArrowLeftStartOnRectangleIcon>
            Logout
          </button>
        </div>
      </form>
    </template>
  </div>

  <Modal v-model="showLogoutModal">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div class="text-sm text-gray-400 dark:text-gray-600">
        Apakah anda yakin ingin logout?
      </div>
      <div class="flex justify-end mt-5 space-x-5">
        <button @click="showLogoutModal = false" class="text-xs font-semibold">
          BATAL
        </button>
        <button
          @click="handleLogout"
          class="text-xs font-semibold text-red-500"
        >
          LOGOUT
        </button>
      </div>
    </div>
  </Modal>
</template>
