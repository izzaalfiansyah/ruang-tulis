import type { Theme } from "~/entities/theme.type";

export const themeStore = defineStore("theme", {
  state: () => {
    let theme = process.client ? localStorage.getItem("theme") : "system";

    if (!["system", "light", "dark"].includes(theme as string)) {
      theme = "system";
    }

    return {
      theme: theme as Theme,
    };
  },
  actions: {
    init(isDark?: boolean) {
      if (isDark == null) {
        isDark = this.theme == "dark";
      }

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    set(theme: Theme) {
      this.theme = theme;

      if (process.client) {
        localStorage.setItem("theme", theme);
      }

      this.init();
    },
  },
});
