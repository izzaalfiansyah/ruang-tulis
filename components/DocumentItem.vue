<script lang="ts" setup>
import type { Document } from "~/entities/document.type";

defineProps<{
  document: Document;
}>();
</script>

<template>
  <NuxtLink
    class="group p-3 rounded transition hover:bg-primary/10 block cursor-pointer"
    :href="`/doc/${document.id}`"
  >
    <div
      class="text-xl font-semibold font-tage group-hover:text-primary transition"
    >
      <span class="mr-2 text-lg">{{ document.icon }}</span
      >{{ document.title }}
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
