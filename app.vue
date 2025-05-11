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
  theme.init();
  auth.init();

  theme.media.addEventListener("change", theme.init);
});

app.seoMeta();
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
