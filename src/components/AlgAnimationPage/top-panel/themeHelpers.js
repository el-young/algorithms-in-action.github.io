/*
  Theme utilities: handles saving/loading system and algorithm themes
  from localStorage, and applying them to the <html> element.
*/

// Keys used in localStorage
export const SYSTEM_THEME_KEY = "data-theme";   // "light" | "dark"
export const ALGO_THEME_KEY   = "algo-theme";   // "default" | "green" | "red" | "grey"

// System themes
export const SYSTEM_THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

// Algo themes
export const ALGO_THEMES = {
  DEFAULT: "default",
  GREEN: "green",
  RED: "red",
  GREY: "grey",
};

/* System Theme */

// Apply theme and save to local storage (for next session retrieval)
export function setSystemTheme(theme) {
  if (!Object.values(SYSTEM_THEMES).includes(theme)) return;
  localStorage.setItem(SYSTEM_THEME_KEY, theme);
  document.documentElement.setAttribute(SYSTEM_THEME_KEY, theme);
}

export function getSystemTheme() {
  const stored = localStorage.getItem(SYSTEM_THEME_KEY);

  // Second condition guards against change in theme name (data-theme)
  if (stored && stored in SYSTEM_THEMES) return stored;

  // Fallback to user OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? SYSTEM_THEMES.DARK
    : SYSTEM_THEMES.LIGHT;
}

/* Algorithm Theme */

export function setAlgoTheme(theme) {
  if (!Object.values(ALGO_THEMES).includes(theme)) return;
  localStorage.setItem(ALGO_THEME_KEY, theme);
  document.documentElement.setAttribute(ALGO_THEME_KEY, theme);
}

export function getAlgoTheme() {
  const stored = localStorage.getItem(ALGO_THEME_KEY);
  if (stored && Object.values(ALGO_THEMES).includes(stored)) return stored;
  return ALGO_THEMES.DEFAULT;
}
