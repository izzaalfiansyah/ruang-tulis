<script lang="ts" setup>
import { authStore } from "~/store/auth.store";
import {
  ArrowLeftEndOnRectangleIcon,
  PlusIcon,
} from "@heroicons/vue/24/outline";

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

        <template v-if="!!auth.user">
          <NuxtLink
            class="inline-flex items-center bg-primary px-5 py-1 rounded-full text-white text-sm uppercase font-semibold"
            href="/doc/new"
            v-if="$route.fullPath != '/doc/new'"
          >
            <PlusIcon class="mr-1.5 size-4"></PlusIcon>
            Tulisan
          </NuxtLink>
        </template>
      </div>
    </div>
    <slot></slot>
    <Footer v-if="!$route.path.includes('doc')"></Footer>
  </div>
</template>
