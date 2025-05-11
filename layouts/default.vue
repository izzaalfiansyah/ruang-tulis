<script lang="ts" setup>
import { authStore } from "~/store/auth.store";
import { ArrowLeftEndOnRectangleIcon } from "@heroicons/vue/24/outline";

const auth = authStore();
</script>

<template>
  <div class="min-h-screen antialiased text-base font-normal">
    <div class="border-b">
      <div class="lg:px-10 px-5 flex items-center w-full justify-between py-3">
        <div class="inline-flex items-center">
          <NuxtLink
            href="/"
            class="text-primary font-semibold font-tage text-xl"
          >
            RuangTulis
          </NuxtLink>
        </div>
        <NuxtLink
          v-if="!auth.user && $route.path != '/login'"
          href="/login"
          class="inline-flex items-center"
        >
          <ArrowLeftEndOnRectangleIcon
            class="mr-1.5 size-4 text-primary"
          ></ArrowLeftEndOnRectangleIcon>
          Login
        </NuxtLink>
      </div>
    </div>
    <slot></slot>
    <Footer></Footer>
  </div>
</template>
