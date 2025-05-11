import type { User } from "~/entities/user.type";
import { AuthRepository } from "~/repository/auth.repository";

export const authStore = defineStore("auth", {
  state(): {
    user?: User;
  } {
    return {};
  },
  actions: {
    async init() {
      if (!this.user) {
        const user = await AuthRepository.init();
        if (!!user) this.setUser(user);
      }
    },
    setUser(user?: User) {
      this.user = user;
    },
  },
});
