<script lang="ts" setup>
import { Document } from "~/entities/document.type";
import { DocumentRepository } from "~/repository/document.repository";
import { appStore } from "~/store/app.store";

const documents = ref<Document[]>([]);
const errorException = ref<string>();
const isLoading = ref(false);

const search = ref("");

async function getDocuments() {
  isLoading.value = true;

  try {
    const result = await DocumentRepository.get();
    documents.value = result as Document[];
  } catch (e) {
    errorException.value = parseError(e);
  }

  isLoading.value = false;
}

onMounted(() => {
  getDocuments();
});

appStore().seoMeta();
</script>

<template>
  <div class="main-container py-10">
    <div class="text-center text-5xl font-bold font-tage text-primary">
      Selamat Datang
    </div>
    <div class="text-center text-sm mt-8">
      Sebuah tempat sunyi di tengah riuhnya dunia. Sebuah taman rahasia tempat
      kata-kata tumbuh bebas. Setiap huruf menjadi jembatan antara isi hati dan
      kenyataan. Engkau bisa menyusun perasaan, membingkai kenangan, atau
      sekadar menyapa diri sendiri.
    </div>
    <div class="mt-10">
      <input
        type="text"
        class="w-full bg-gray-50 dark:bg-gray-800 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition"
        placeholder="Cari Tulisan..."
        v-model="search"
      />
    </div>
    <div class="mt-10 pt-10 border-t">
      <div class="space-y-3">
        <template v-if="isLoading">
          <div class="text-center">
            <SpinLoader></SpinLoader>
          </div>
        </template>
        <template v-else-if="errorException">
          <div class="text-center">{{ errorException }}</div>
        </template>
        <template v-else>
          <template
            v-if="!!documents.length"
            v-for="document in documents.filter(
              (doc) =>
                doc.title.toLowerCase().includes(search.toLowerCase()) ||
                (doc.description ?? '')
                  .toLowerCase()
                  .includes(search.toLowerCase())
            )"
          >
            <DocumentItem :document="document"></DocumentItem>
          </template>
          <template v-else>
            <div class="text-center">Tulisan belum tersedia</div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
