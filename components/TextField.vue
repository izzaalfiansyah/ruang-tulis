<script lang="ts" setup>
import type { InputHTMLAttributes } from "vue";

interface Props extends /* @vue-ignore */ InputHTMLAttributes {
  modelValue: string;
  error?: string;
}

defineComponent({
  inheritAttrs: false,
});

defineProps<Props>();

defineEmits(["update:modelValue"]);
</script>

<template>
  <div>
    <input
      class="border rounded px-3 py-2 outline-none focus:ring-2 focus:ring-primary transition bg-transparent w-full"
      :class="{ 'ring-2 ring-red-500': !!error }"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
      v-bind="$attrs"
    />
    <div v-if="error" class="text-xs mt-1 text-red-500">
      {{ error }}
    </div>
  </div>
</template>
