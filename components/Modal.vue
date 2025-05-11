<script lang="ts" setup>
defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

function closeModal() {
  emit("update:modelValue", false);
}
</script>

<style lang="scss">
.modal {
  & > .modal-content {
    animation: scale-in 0.3s ease-in-out;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>

<template>
  <div
    class="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center lg:p-10 p-5 modal z-20"
    v-if="modelValue"
  >
    <div
      class="fixed top-0 left-0 right-0 bottom-0 bg-black/30"
      @click="closeModal"
    ></div>
    <div @click.prevent="() => {}" class="modal-content relative">
      <slot></slot>
    </div>
  </div>
</template>
