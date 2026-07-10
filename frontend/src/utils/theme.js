export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
}

export function getSavedTheme() {
  return localStorage.getItem('theme') || THEMES.LIGHT;
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

export function saveTheme(theme) {
  localStorage.setItem('theme', theme);
}
