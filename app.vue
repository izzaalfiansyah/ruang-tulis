<style lang="scss">
@use "./app.scss";
</style>

<script lang="ts" setup>
import { useTheme } from "./store/useTheme";

const theme = useTheme();

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
