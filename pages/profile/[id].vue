<script lang="ts" setup>
import type { Document } from "~/entities/document.type";
import type { User } from "~/entities/user.type";
import { DocumentRepository } from "~/repository/document.repository";
import { UserRepository } from "~/repository/user.repository";
import { appStore } from "~/store/app.store";

const isLoading = ref(false);
const isDocumentsLoading = ref(false);
const user = ref<User>();
const documents = ref<Document[]>([]);
const errorException = ref("");

const userId = useRoute().params.id;

async function getUser() {
  isLoading.value = true;

  try {
    const result = await UserRepository.get(userId);

    user.value = result;

    getDocuments();
  } catch (e) {
    errorException.value = parseError(e);
  }

  isLoading.value = false;
}

async function getDocuments() {
  isDocumentsLoading.value = true;
  try {
    const result = await DocumentRepository.get({
      authorId: userId.toString(),
    });

    documents.value = result as Document[];
  } catch (e) {
    console.log(e);
  }
  isDocumentsLoading.value = false;
}

watch(user, () => {
  appStore().seoMeta({
    title: user.value?.name,
    description: user.value?.bio,
  });
});

onMounted(() => {
  getUser();
});
</script>

<template>
  <div class="py-10 main-container">
    <template v-if="isLoading">
      <div class="text-center">
        <SpinLoader></SpinLoader>
      </div>
    </template>
    <template v-if="user">
      <div class="text-4xl font-bold text-primary font-tage">
        {{ user.name }}
      </div>
      <div class="mt-1 font-tage text-sm font-light">
        <span class="font-tage">{{ user.email }}</span>
        <span class="font-tage" v-if="user.phone"> | {{ user.phone }}</span>
      </div>
      <div class="mt-5 text-gray-500 text-sm">{{ user.bio }}</div>
    </template>

    <div class="mt-10">
      <template v-if="isDocumentsLoading">
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
