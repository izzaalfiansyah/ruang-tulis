<template>
  <div class="min-h-screen antialiased text-base font-normal">
    <div class="border-b">
      <div class="main-container d-flex items-center justify-between py-3">
        <div class="inline-flex items-center">
          <NuxtLink
            href="/"
            class="text-primary font-semibold font-tage text-xl"
          >
            RuangTulis
          </NuxtLink>
        </div>
      </div>
    </div>
    <slot></slot>
    <Footer></Footer>
  </div>
</template>
