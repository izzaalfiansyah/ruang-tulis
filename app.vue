<style lang="scss">
@use "./app.scss";
</style>

<script lang="ts" setup>
import { AuthRepository } from "./repository/auth.repository";
import { authStore } from "./store/auth.store";
import { themeStore } from "./store/theme.store";

const theme = themeStore();
const auth = authStore();

onMounted(() => {
  theme.init();
  auth.init();

  theme.media.addEventListener("change", theme.init);
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage></NuxtPage>
  </NuxtLayout>
</template>
