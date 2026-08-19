import { ref } from "vue";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const media = window.matchMedia("(prefers-color-scheme: dark)");

function systemTheme(): Theme {
  return media.matches ? "dark" : "light";
}

function storedTheme(): Theme | null {
  const value = localStorage.getItem(STORAGE_KEY);
  return value === "light" || value === "dark" ? value : null;
}

// Reflects the resolved theme for display (e.g. the toggle's label). The
// actual styling is driven by the data-theme attribute + CSS media query,
// not by this ref directly.
const theme = ref<Theme>(storedTheme() ?? systemTheme());

media.addEventListener("change", (event) => {
  if (!storedTheme()) {
    theme.value = event.matches ? "dark" : "light";
  }
});

export function useTheme() {
  function toggle() {
    theme.value = theme.value === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, theme.value);
    document.documentElement.dataset.theme = theme.value;
  }

  return { theme, toggle };
}
