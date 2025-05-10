<script lang="ts" setup>
import type { Document } from "~/entities/document.type";
import { Failure } from "~/entities/failure.type";
import { DocumentRepository } from "~/repository/document.repository";
import { authStore } from "~/store/auth.store";

const params = useRoute().params;
const document = ref<Document>();
const isLoading = ref<boolean>(false);
const errorException = ref<Failure | null>();

const auth = authStore();

async function getDocument() {
  isLoading.value = true;

  const result = await DocumentRepository.find(params.id);

  if (result instanceof Failure) {
    errorException.value = result;
  }

  document.value = result as Document;

  isLoading.value = false;
}

const isCanEdit = computed(() => auth.user?.id == document.value?.author?.id);

onMounted(() => {
  getDocument();
});
</script>

<template>
  <template v-if="!!document">
    <template v-if="document.cover">
      <img
        :src="document.cover"
        :alt="document.title"
        class="w-full object-cover h-44"
      />
    </template>
    <div class="main-container py-10">
      <template v-if="document.icon">
        <div class="text-5xl">{{ document.icon }}</div>
      </template>
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
      <div class="mt-5 space-x-1.5">
        <template v-for="tag in document.tags">
          <div class="inline-flex items-center">
            <div class="text-sm text-primary bg-primary/10 rounded px-2 py-1">
              #{{ tag }}
            </div>
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
