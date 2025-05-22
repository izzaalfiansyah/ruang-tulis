<script lang="ts" setup>
import {
  ArrowLongLeftIcon,
  ArrowUpTrayIcon,
  FaceSmileIcon,
  PencilIcon,
  PhotoIcon,
  ShareIcon,
  TrashIcon,
} from "@heroicons/vue/24/outline";
import type { Document } from "~/entities/document.type";
import { DocumentRepository } from "~/repository/document.repository";
import { authStore } from "~/store/auth.store";
import { themeStore } from "~/store/theme.store";
import { appStore } from "~/store/app.store";
import { showToast } from "~/utils/notification";

const params = useRoute().params;
const document = ref<Document>();
const isLoading = ref<boolean>(false);
const errorException = ref<string>();

const showTagModal = ref<boolean>(false);
const showIconModal = ref<boolean>(false);
const showCoverModal = ref<boolean>(false);
const showDeleteModal = ref<boolean>(false);
const isCoverIsLink = ref<boolean>(false);

const auth = authStore();
const theme = themeStore();
const app = appStore();

async function getDocument() {
  isLoading.value = true;

  try {
    const result = await DocumentRepository.find(params.id);
    document.value = result;

    if (document.value.cover) {
      isCoverIsLink.value = document.value.cover.startsWith("http");

      if (!isValidLink(document.value.cover)) {
        document.value.cover = "";
      }
    }
  } catch (e) {
    errorException.value = parseError(e);
  }

  isLoading.value = false;
}

const isCreateNew = computed(() => params.id == "new");
const isCanEdit = computed(
  () => auth.user?.id == document.value?.author?.id || isCreateNew.value
);

const handleUploadCover = (e: Event) => {
  const files = (e.currentTarget as HTMLInputElement).files;

  if (files) {
    const file = files[0];
    if (!!file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (!!document.value) {
          document.value.cover = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
};

const fileInput = ref<HTMLInputElement>();

async function saveDocument() {
  isLoading.value = true;

  try {
    const documentId = await DocumentRepository.save(document.value!);

    if (documentId != params.id) {
      useRouter().replace(`/doc/${documentId}`);
    }

    showToast("Berhasil menyimpan tulisan", {
      isSuccess: true,
    });
  } catch (e) {
    document.value!.id = null;
    showToast(parseError(e));
  }

  isLoading.value = false;
}

async function deleteDocument() {
  isLoading.value = true;

  try {
    await DocumentRepository.destroy(document.value!);

    useRouter().replace("/");
  } catch (e) {
    showToast(parseError(e));
  }

  isLoading.value = false;
}

function createNewDocument() {
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
}

function shareDocument() {
  try {
    navigator.share({
      title: document.value?.title,
      text: document.value?.description,
      url: window.location.href,
    });
  } catch (e) {
    //
  }
}

watch(
  () => auth.user,
  () => {
    if (isCreateNew.value) {
      createNewDocument();
    }
  }
);

watch(document, () => {
  app.seoMeta({
    title: document.value?.id ? document.value?.title : "Tulisan Baru",
    description: document.value?.description,
  });
});

onMounted(() => {
  if (isCreateNew.value) {
    createNewDocument();
  } else {
    getDocument();
  }
});
</script>

<template>
  <template v-if="errorException">
    <div class="my-20 text-center">{{ errorException }}</div>
  </template>
  <template v-else>
    <template v-if="!!document">
      <template v-if="document.cover">
        <div class="relative">
          <img
            :src="document.cover"
            :alt="document.title"
            class="w-full object-cover h-44"
            :class="{ 'cursor-pointer': isCanEdit }"
            @click="
              () => {
                if (isCanEdit) {
                  fileInput?.click();
                }
              }
            "
          />

          <div class="absolute right-5 bottom-5" v-if="isCanEdit">
            <button
              class="size-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800"
              @click="document.cover = ''"
            >
              <TrashIcon
                class="size-5 text-gray-500 cursor-pointer"
              ></TrashIcon>
            </button>
          </div>
        </div>
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
              @click="fileInput?.click"
            >
              <PhotoIcon class="size-4 mr-2"></PhotoIcon>
              Pilih Cover
            </button>
          </template>
        </div>
        <form>
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            @change="handleUploadCover"
            @click="
              fileInput!.value = '';
              fileInput!.files = null;
            "
            class="hidden"
          />
        </form>
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
            <NuxtLink
              :href="isCreateNew ? 'javascript:void(0)' : `/tags/${tag}`"
              class="inline-flex items-center"
            >
              <div class="text-sm text-primary bg-primary/10 rounded px-2 py-1">
                #{{ tag }}
              </div>
            </NuxtLink>
          </template>
          <template v-if="document.tags.length > 0 && isCanEdit">
            <div
              @click="
                () => {
                  if (isCanEdit) {
                    showTagModal = true;
                  }
                }
              "
              class="rounded-full size-6 inline-flex items-center justify-center bg-gray-100 dark:bg-gray-800 cursor-pointer"
            >
              <PencilIcon class="size-3"></PencilIcon>
            </div>
          </template>
          <template v-if="isCanEdit && document.tags.length == 0">
            <div
              class="text-gray-400 dark:text-gray-600 text-sm cursor-pointer"
              @click="
                () => {
                  if (isCanEdit) {
                    showTagModal = true;
                  }
                }
              "
            >
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
                placeholder="Tempat Menulis"
                v-model="document.place"
              />
            </template>
            <template v-else>
              {{ document.place }}
            </template>
            , {{ formatDate(document.date) }}
          </div>
          <template v-if="document.author">
            by
            <NuxtLink
              :href="`/profile/${document.author.id}`"
              class="text-primary"
              >{{ document.author.name }}</NuxtLink
            >
          </template>
        </div>
        <div class="mt-10 pt-10 border-t">
          <Editor v-model="document.content" :editable="isCanEdit"></Editor>
        </div>
      </div>
    </template>
  </template>
  <div class="pb-14 mt-5 main-container flex items-center justify-between">
    <NuxtLink
      to="/"
      class="inline-flex items-center hover:text-primary transition uppercase text-sm"
      v-if="!isCanEdit"
    >
      <ArrowLongLeftIcon class="mr-1.5 size-4"></ArrowLongLeftIcon>
      Lainnya
    </NuxtLink>
    <div></div>

    <template v-if="!!document">
      <div class="inline-flex items-center space-x-6">
        <button
          class="inline-flex items-center text-red-500 transition outline-none uppercase text-sm"
          @click="showDeleteModal = true"
          v-if="!!document.id && isCanEdit"
        >
          <TrashIcon class="mr-1.5 size-4"></TrashIcon>
          Hapus
        </button>
        <button
          class="inline-flex items-center transition outline-none uppercase text-sm"
          v-if="!!document.id"
          @click="shareDocument"
        >
          <ShareIcon class="mr-1.5 size-4"></ShareIcon>
          Share
        </button>
        <button
          class="inline-flex items-center hover:text-primary transition outline-none uppercase text-sm"
          @click="saveDocument"
          v-if="isCanEdit"
        >
          <ArrowUpTrayIcon class="mr-1.5 size-4"></ArrowUpTrayIcon>
          Simpan
        </button>
      </div>
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
      <ClientOnly>
        <EmoPicker
          @select="
            (e: any) => {
              if (!!document) {
                document.icon = e.i;
                showIconModal = false;
              }
            }
          "
        ></EmoPicker>
      </ClientOnly>
    </div>
  </Modal>

  <Modal v-model="showCoverModal">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div class="mb-4 rounded border p-1 flex justify-stretch">
        <button
          type="button"
          class="px-3 py-1 rounded grow text-center"
          :class="{ 'bg-primary text-white': !isCoverIsLink }"
          @click="isCoverIsLink = false"
        >
          Upload
        </button>
        <button
          type="button"
          class="px-3 py-1 rounded grow text-center"
          :class="{ 'bg-primary text-white': isCoverIsLink }"
          @click="isCoverIsLink = true"
        >
          Link
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
        <form action="">
          <div for="" class="text-sm mb-2">Pilih Gambar:</div>
          <input
            type="file"
            class="w-full bg-transparent border rounded px-3 py-2 placeholder:text-gray-400 dark:placeholder:text-gray-600 file:bg-primary file:text-white file:rounded file:mr-2 file:border-none cursor-pointer outline-none file:cursor-pointer"
            accept="image/*"
            @change="handleUploadCover"
          />
        </form>
      </template>

      <div class="flex justify-end mt-5">
        <template v-if="document?.cover">
          <button
            class="text-primary text-xs font-semibold mr-5"
            @click="document.cover = ''"
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

  <Modal v-model="isLoading">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div class="text-center">
        <SpinLoader></SpinLoader>
      </div>
    </div>
  </Modal>

  <Modal v-model="showDeleteModal">
    <div class="p-5 rounded bg-background max-w-full w-[340px]">
      <div class="text-sm text-gray-400 dark:text-gray-600">
        Apakah anda yakin ingin menghapus tulisan ini?
      </div>
      <div class="flex justify-end mt-5 space-x-5">
        <button @click="showDeleteModal = false" class="text-xs font-semibold">
          BATAL
        </button>
        <button
          @click="deleteDocument"
          class="text-xs font-semibold text-red-500"
        >
          HAPUS
        </button>
      </div>
    </div>
  </Modal>
</template>
