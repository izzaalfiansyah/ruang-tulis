<script lang="ts" setup>
import type { Document } from "~/entities/document.type";
import { DocumentRepository } from "~/repository/document.repository";
import { appStore } from "~/store/app.store";

const tag: string = useRoute().params.tag.toString();
const app = appStore();

const documents = ref<Document[]>([]);
const isLoading = ref(false);

async function getDocuments() {
  isLoading.value = true;
  try {
    const result = await DocumentRepository.get({
      tag,
    });

    documents.value = result as Document[];
  } catch (e) {
    console.log(e);
  }
  isLoading.value = false;
}

onMounted(() => {
  getDocuments();
});

app.seoMeta({
  title: `Tag #${tag}`,
});
</script>

<template>
  <div class="py-10 main-container">
    <div class="text-4xl font-bold text-primary font-tage">🚀 #{{ tag }}</div>
    <div class="mt-10 min-h-[60vh]">
      <template v-if="isLoading">
        <div class="text-center">
          <SpinLoader></SpinLoader>
        </div>
      </template>
      <template v-else-if="documents.length">
        <div class="space-y-2">
          <template v-for="document in documents">
            <DocumentItem :document="document"></DocumentItem>
          </template>
        </div>
      </template>
      <template v-else>
        <div class="text-center">Tulisan tidak ditemukan</div>
      </template>
    </div>
  </div>
</template>
