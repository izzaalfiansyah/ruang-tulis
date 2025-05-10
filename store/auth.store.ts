import type { User } from "~/entities/user.type";

export const authStore = defineStore("auth", {
  state(): {
    user?: User;
  } {
    return {};
  },
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});
