<script setup lang="ts">
import "vue3-emoji-picker/css";
import { themeStore } from "../store/theme.store";

const EmojiPicker = defineAsyncComponent(() => import("vue3-emoji-picker"));

const theme = themeStore();
</script>

<template>
  <EmojiPicker
    :native="true"
    :theme="(theme.theme == 'system' ? 'auto' : theme.theme as any)"
    @select=""
  ></EmojiPicker>
</template>
