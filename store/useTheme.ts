import type { Theme } from "~/@types/theme.type";

export const useTheme = defineStore("theme", {
  state: () => {
    let theme = localStorage.getItem("theme");
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    if (!["system", "light", "dark"].includes(theme as string)) {
      theme = "system";
    }

    return {
      theme: theme as Theme,
      media,
    };
  },
  actions: {
    init() {
      let isDark = this.theme == "dark";

      if (this.theme == "system") {
        isDark = this.media.matches;
      }

      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    set(theme: Theme) {
      this.theme = theme;
      localStorage.setItem("theme", theme);

      this.init();
    },
  },
});
