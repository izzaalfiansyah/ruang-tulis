<style lang="scss">
@use "./app.scss";
</style>

<script lang="ts" setup>
import { appStore } from "./store/app.store";
import { authStore } from "./store/auth.store";
import { themeStore } from "./store/theme.store";

const theme = themeStore();
const auth = authStore();
const app = appStore();

onMounted(() => {
  if (process.client) {
    theme.init();
    auth.init();

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    theme.init(media.matches);

    media.addEventListener("change", () => {
      theme.init(media.matches);
    });
  }
});

app.seoMeta();
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
