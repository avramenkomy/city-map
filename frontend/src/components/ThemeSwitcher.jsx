import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { applyTheme, getSavedTheme, saveTheme, THEMES } from '../utils/theme';

function ThemeSwitcher() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState(getSavedTheme);

  function handleChangeTheme(nexTheme) {
    setTheme(nexTheme);
    saveTheme(nexTheme);
    applyTheme(nexTheme);
  }

  return(
    <div
      className="theme-switcher"
      aria-label={t('theme.label')}
    >
      <button
        className={theme === THEMES.LIGHT ? 'is-active' : ''}
        type="button"
        onClick={() => handleChangeTheme(THEMES.LIGHT)}
      >
        {t('theme.light')}
      </button>

      <button
        className={theme === THEMES.DARK ? 'is-active' : ''}
        type="button"
        onClick={() => handleChangeTheme(THEMES.DARK)}
      >
        {t('theme.dark')}
      </button>
    </div>
  )
}

export default ThemeSwitcher;
