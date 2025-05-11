import { authStore } from "~/store/auth.store";

export default defineNuxtRouteMiddleware((to, from) => {
  if (authStore().user) {
    return navigateTo("/");
  }
});
