import type { FunctionalComponent, HTMLAttributes, VNodeProps } from "vue";

export type Theme = "system" | "light" | "dark";
export interface ThemeData {
  theme: Theme;
  label: string;
  icon: FunctionalComponent<HTMLAttributes & VNodeProps, {}, any, {}>;
}
