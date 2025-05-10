<script lang="ts" setup>
import { Document } from "~/entities/document.type";
import { Failure } from "~/entities/failure.type";
import { DocumentRepository } from "~/repository/document.repository";

const documents = ref<Document[]>([]);
const errorException = ref<Failure | null>(null);
const isLoading = ref(false);

async function getDocuments() {
  isLoading.value = true;
  const result = await DocumentRepository.get();

  console.log(result);

  if (result instanceof Failure) {
    errorException.value = result;
  }

  documents.value = result as Document[];
  isLoading.value = false;
}

onMounted(() => {
  getDocuments();
});
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
      />
    </div>
    <div class="mt-10 pt-10 border-t">
      <div class="space-y-3">
        <template v-if="!!documents.length" v-for="document in documents">
          <NuxtLink
            class="group p-3 rounded transition hover:bg-primary/10 block cursor-pointer"
            :href="document.slug"
          >
            <div
              class="text-xl font-semibold font-tage group-hover:text-primary transition"
            >
              {{ document.title }}
            </div>
            <div class="text-sm text-gray-600 dark:text-gray-400 truncate">
              {{ document.description }}
            </div>

            <div class="mt-5">
              <div class="text-xs text-primary">
                <!-- <div>Oleh: {{ document.author.name }}</div> -->
                {{ document.place }},
                {{ formatDate(document.date) }}
              </div>
            </div>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>
