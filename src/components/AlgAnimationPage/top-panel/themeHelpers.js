/*
  Theme utilities: handles saving/loading system and algorithm themes
  from localStorage.
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

// System theme buttons
export const allSystemCol = Object.values(SYSTEM_THEMES).map((theme) => ({
  id: theme,
  primary: theme === SYSTEM_THEMES.LIGHT ? "white" : "black",
  secondary: theme === SYSTEM_THEMES.LIGHT ? "white" : "black",
}));

// Algo theme buttons
const algoColorMap = {
  [ALGO_THEMES.DEFAULT]: ["positive1", "negative1", "hint1", "back-up1"],
  [ALGO_THEMES.GREEN]:   ["positive2", "negative2", "hint2", "back-up2"],
  [ALGO_THEMES.RED]:     ["cyan", "purple", "green", "yellow"],
  [ALGO_THEMES.GREY]:    ["white", "grey", "dark-grey", "black"],
};

export const allColBtn = Object.entries(algoColorMap).map(([id, [primary, secondary, third, fourth]]) => ({
  id,
  primary,
  secondary,
  third,
  fourth,
}));

/* System Theme */

// Apply theme and save to local storage (for next session retrieval)
export function setSystemTheme(theme) {
  if (!Object.values(SYSTEM_THEMES).includes(theme)) return;
  localStorage.setItem(SYSTEM_THEME_KEY, theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function getSystemTheme() {
  const stored = localStorage.getItem(SYSTEM_THEME_KEY);

  if (stored && Object.values(SYSTEM_THEMES).includes(stored)) return stored;

  // Fallback to user OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? SYSTEM_THEMES.DARK
    : SYSTEM_THEMES.LIGHT;
}

/* Algorithm Theme */

export function setAlgoTheme(theme) {
  if (!Object.values(ALGO_THEMES).includes(theme)) return;
  localStorage.setItem(ALGO_THEME_KEY, theme);
  document.documentElement.setAttribute("algo-theme", theme);
}

export function getAlgoTheme() {
  const stored = localStorage.getItem(ALGO_THEME_KEY);
  if (stored && Object.values(ALGO_THEMES).includes(stored)) return stored;
  return ALGO_THEMES.DEFAULT;
}
