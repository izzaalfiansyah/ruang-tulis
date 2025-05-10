<script lang="ts" setup>
import type { Document } from "~/entities/document.type";
import { Failure } from "~/entities/failure.type";
import { DocumentRepository } from "~/repository/document.repository";

const params = useRoute().params;
const document = ref<Document>();
const isLoading = ref<boolean>(false);
const errorException = ref<Failure | null>();

async function getDocument() {
  isLoading.value = true;

  const result = await DocumentRepository.find(params.id);

  if (result instanceof Failure) {
    errorException.value = result;
  }

  console.log(result);

  document.value = result as Document;

  isLoading.value = false;
}

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
        class="w-full object-cover h-36"
      />
    </template>
    <div class="main-container py-10">
      <template v-if="document.icon">
        <div class="text-5xl">{{ document.icon }}</div>
      </template>
      <div class="mt-4 text-4xl font-bold font-tage text-primary">
        {{ document.title }}
      </div>
      <div class="mt-2" v-if="document.description">
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
        <div>{{ document.place }}, {{ formatDate(document.date) }}</div>
        <template v-if="document.author">
          by <a href="/" class="text-primary">{{ document.author?.name }}</a>
        </template>
      </div>
      <div class="mt-10 pt-10 border-t">
        <div class="document-content" v-html="document.content"></div>
      </div>
    </div>
  </template>
</template>
