<style lang="scss">
@use "./app.scss";
</style>

<script lang="ts" setup>
import { themeStore } from "./store/theme.store";

const theme = themeStore();

onMounted(() => {
  theme.init();

  theme.media.addEventListener("change", theme.init);
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
