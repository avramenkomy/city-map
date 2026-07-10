import { useTranslation } from 'react-i18next';

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  function handleLanguageChange(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  }

  return (
    <div className="language-switcher" aria-label={t('language.label')}>
      <button
        className={i18n.language === 'ru' ? 'is-active' : ''}
        type="button"
        onClick={() => handleLanguageChange('ru')}
      >
        RU
      </button>

      <button
        className={i18n.language === 'en' ? 'is-active' : ''}
        type="button"
        onClick={() => handleLanguageChange('en')}
      >
        EN
      </button>
    </div>
  )
}

export default LanguageSwitcher;
