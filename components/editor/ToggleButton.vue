<script lang="ts" setup>
import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

defineProps<{
  icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
  isActive?: boolean;
  isDisabled?: boolean;
}>();
</script>

<template>
  <button
    type="button"
    class="border border-gray-200 dark:border-gray-700 rounded h-8 inline-flex items-center justify-center transition outline-none"
    :class="{
      'bg-primary/25 text-white': isActive,
      'w-8': !$slots.default,
      'cursor-not-allowed text-gray-400 dark:text-gray-600': isDisabled,
    }"
  >
    <component :is="icon" class="size-4"></component>
    <slot></slot>
  </button>
</template>
