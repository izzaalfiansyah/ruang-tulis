<script lang="ts" setup>
import { CpuChipIcon, MoonIcon, SunIcon } from "@heroicons/vue/24/outline";
import type { ThemeData } from "~/entities/theme.type";
import { themeStore } from "~/store/theme.store";

const theme = themeStore();

const themes: ThemeData[] = [
  {
    label: "System",
    theme: "system",
    icon: CpuChipIcon,
  },
  {
    label: "Light",
    theme: "light",
    icon: SunIcon,
  },
  {
    label: "Dark",
    theme: "dark",
    icon: MoonIcon,
  },
];
</script>

<template>
  <div class="inline-flex items-center space-x-2 border rounded-full px-2 py-1">
    <template v-for="t in themes">
      <button
        type="button"
        :class="{ 'text-primary': t.theme == theme.theme }"
        @click="theme.set(t.theme)"
      >
        <component :is="t.icon" class="size-5"></component>
      </button>
    </template>
  </div>
</template>
