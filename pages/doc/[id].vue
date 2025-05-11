<script lang="ts" setup>
import "vue3-emoji-picker/css";

import {
  ArrowLongLeftIcon,
  ArrowUpTrayIcon,
  FaceSmileIcon,
  PhotoIcon,
} from "@heroicons/vue/24/outline";
import type { Document } from "~/entities/document.type";
import { DocumentRepository } from "~/repository/document.repository";
import { authStore } from "~/store/auth.store";
import EmojiPicker, { type EmojiExt } from "vue3-emoji-picker";
import { themeStore } from "~/store/theme.store";

const params = useRoute().params;
const document = ref<Document>();
const isLoading = ref<boolean>(false);
const errorException = ref<string>();

const showTagModal = ref<boolean>(false);
const showIconModal = ref<boolean>(false);
const showCoverModal = ref<boolean>(false);
const isCoverIsLink = ref<boolean>(true);

const auth = authStore();
const theme = themeStore();

async function getDocument() {
  isLoading.value = true;

  try {
    const result = await DocumentRepository.find(params.id);
    document.value = result;

    if (document.value.cover) {
      isCoverIsLink.value = document.value.cover.startsWith("http");

      if (!isValidLink(document.value.cover)) {
        document.value.cover = undefined;
      }
    }
  } catch (e) {
    errorException.value = parseError(e);
  }

  isLoading.value = false;
}

const isCanEdit = computed(
  () => auth.user?.id == document.value?.author?.id || params.id == "new"
);

onMounted(() => {
  if (params.id == "new") {
    document.value = {
      title: "",
      description: "",
      content: "",
      tags: [],
      date: new Date(Date.now()),
      place: "",
      icon: "",
      cover: "",
      id: null,
      author: auth.user,
    };
  } else {
    getDocument();
  }
});
</script>

<template>
  <template v-if="isLoading">
    <div class="text-center my-20">
      <SpinLoader></SpinLoader>
    </div>
  </template>
  <template v-else-if="errorException">
    <div class="my-20 text-center">{{ errorException }}</div>
  </template>
  <template v-else>
    <template v-if="!!document">
      <template v-if="document.cover">
        <img
          :src="document.cover"
          :alt="document.title"
          class="w-full object-cover h-44"
          :class="{ 'cursor-pointer': isCanEdit }"
          @click="
            () => {
              if (isCanEdit) {
                showCoverModal = true;
              }
            }
          "
        />
      </template>
      <div class="main-container py-10">
        <div
          :class="{ 'cursor-pointer inline-block': isCanEdit }"
          @click="
            () => {
              if (isCanEdit) {
                showIconModal = true;
              }
            }
          "
        >
          <template v-if="document.icon">
            <div class="text-7xl">{{ document.icon }}</div>
          </template>
        </div>

        <div
          class="mt-5 space-x-2"
          v-if="isCanEdit && (!document.icon || !document.cover)"
        >
          <template v-if="!document.icon">
            <button
              type="button"
              class="font-semibold uppercase text-xs rounded bg-gray-200 dark:bg-gray-700 px-3 py-2 inline-flex items-center"
              @click="
                () => {
                  if (isCanEdit) {
                    showIconModal = true;
                  }
                }
              "
            >
              <FaceSmileIcon class="size-4 mr-2"></FaceSmileIcon>
              Pilih Icon
            </button>
          </template>
          <template v-if="!document.cover">
            <button
              type="button"
              class="font-semibold uppercase text-xs rounded bg-gray-200 dark:bg-gray-700 px-3 py-2 inline-flex items-center"
              @click="
                () => {
                  if (isCanEdit) {
                    showCoverModal = true;
                  }
                }
              "
            >
              <PhotoIcon class="size-4 mr-2"></PhotoIcon>
              Pilih Cover
            </button>
          </template>
        </div>
        <div class="mt-4">
          <input
            type="text"
            v-if="isCanEdit"
            class="text-4xl placeholder:text-4xl font-tage font-bold text-primary outline-none bg-transparent h-14"
            placeholder="Judul Tulisan"
            v-model="document.title"
          />
          <div class="text-4xl font-bold font-tage text-primary" v-else>
            {{ document.title }}
          </div>
        </div>
        <input
          type="text"
          v-if="isCanEdit"
          placeholder="Masukkan deskripsi tulisan"
          class="w-full outline-none bg-transparent resize-none"
          v-model="document.description"
        />
        <div class="mt-2" v-else v-if="document.description">
          {{ document.description }}
        </div>
        <div
          class="mt-5 space-x-1.5"
          :class="{ 'cursor-pointer inline-block': isCanEdit }"
          @click="
            () => {
              if (isCanEdit) {
                showTagModal = true;
              }
            }
          "
        >
          <template v-for="tag in document.tags">
            <div class="inline-flex items-center">
              <div class="text-sm text-primary bg-primary/10 rounded px-2 py-1">
                #{{ tag }}
              </div>
            </div>
          </template>
          <template v-if="isCanEdit && document.tags.length == 0">
            <div class="text-gray-400 dark:text-gray-600 text-sm">
              Tidak ada tags
            </div>
          </template>
        </div>
        <div class="mt-8 text-sm">
          <div>
            <template v-if="isCanEdit">
              <input
                type="text"
                class="bg-transparent outline-none border-b"
                placeholder="Tempat"
                v-model="document.place"
              />
            </template>
            <template v-else>
              {{ document.place }}
            </template>
            , {{ formatDate(document.date) }}
          </div>
          <template v-if="document.author">
            by <a href="/" class="text-primary">{{ document.author?.name }}</a>
          </template>
        </div>
        <div class="mt-10 pt-10 border-t">
          <Editor v-model="document.content" :editable="isCanEdit"></Editor>
        </div>
      </div>
    </template>
  </template>
  <div class="mb-10 mt-5 main-container flex items-center justify-between">
    <NuxtLink
      to="/"
      class="inline-flex items-center hover:text-primary transition"
    >
      <ArrowLongLeftIcon class="mr-1.5 size-4"></ArrowLongLeftIcon>
      {{ params?.id == "new" ? "Kembali" : "Lainnya" }}
    </NuxtLink>

    <template v-if="!!document && isCanEdit">
      <button class="inline-flex items-center hover:text-primary transition">
        <ArrowUpTrayIcon class="mr-1.5 size-4"></ArrowUpTrayIcon>
        Simpan
      </button>
    </template>
  </div>

  <Modal v-model="showTagModal">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div for="" class="text-sm mb-2">Tags:</div>
      <TextField
        :value="document?.tags.join(', ')"
        @input="(e: Event) => {
          if (!!document) {
            const value = (e.currentTarget as HTMLInputElement).value;
            if (!!value) {
              document.tags = (e.currentTarget as HTMLInputElement).value.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0);
            }
          }
      }"
        placeholder="Masukkan tags"
      ></TextField>
      <div class="text-xs text-gray-400 dark:text-gray-600 mt-2">
        <div>Pisahkan dengan tanda koma (,)</div>
        <div>Contoh: <span class="text-primary">halo, dunia, kita</span></div>
      </div>
      <div class="flex justify-end mt-5">
        <button
          class="text-primary text-xs font-semibold"
          @click="showTagModal = false"
        >
          TUTUP
        </button>
      </div>
    </div>
  </Modal>

  <Modal v-model="showIconModal">
    <div class="max-w-full w-[340px]">
      <EmojiPicker
        :native="true"
        :theme="(theme.theme == 'system' ? 'auto' : theme.theme as any)"
        @select="(e: EmojiExt) => {
          if (!!document) {
            document.icon = e.i;
            showIconModal = false;
          }
        }"
      ></EmojiPicker>
    </div>
  </Modal>

  <Modal v-model="showCoverModal">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div class="mb-4 rounded border p-1 flex justify-stretch">
        <button
          type="button"
          class="px-3 py-1 rounded grow text-center"
          :class="{ 'bg-primary text-white': isCoverIsLink }"
          @click="isCoverIsLink = true"
        >
          Link
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded grow text-center"
          :class="{ 'bg-primary text-white': !isCoverIsLink }"
          @click="isCoverIsLink = false"
        >
          Upload
        </button>
      </div>

      <template v-if="isCoverIsLink">
        <div for="" class="text-sm mb-2">Cover URL:</div>
        <TextField
          :value="document?.cover"
          @change="
            if (!!document) {
              const value = ($event.currentTarget as HTMLInputElement).value;

              if (!!value && isValidLink(value)) {
                document.cover = value;
              }
            }
          "
          :error="
            isCoverIsLink
              ? isValidLink(document?.cover ?? '')
                ? ''
                : 'URL tidak valid'
              : ''
          "
          placeholder="Masukkan Url Gambar"
        ></TextField>
      </template>

      <template v-else>
        <div for="" class="text-sm mb-2">Pilih Gambar:</div>
        <input
          type="file"
          class="w-full bg-transparent border rounded px-3 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-600 file:bg-primary file:text-white file:rounded file:mr-2 file:border-none cursor-pointer outline-none"
          accept="image/*"
          @change="(e: Event) => {
            console.log(e);
          }"
        />
      </template>

      <div class="flex justify-end mt-5">
        <template v-if="document?.cover">
          <button
            class="text-primary text-xs font-semibold mr-2"
            @click="
              document.cover = undefined;
              showCoverModal = false;
            "
          >
            HAPUS
          </button>
        </template>
        <button
          class="text-primary text-xs font-semibold"
          @click="showCoverModal = false"
        >
          TUTUP
        </button>
      </div>
    </div>
  </Modal>
</template>
