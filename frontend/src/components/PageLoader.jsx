import { useTranslation } from 'react-i18next';

function PreLoader() {
  const { t } = useTranslation();

  return (
    <div
      className="page-loader"
      role="status"
      aria-live="polite"
      aria-label={t('places.loadingAria')}
    >
      <div className="page-loader__content">
        <span className="page-loader__spinner" aria-hidden="true" />
        <span className="page-loader__text">{t('places.loading')}</span>
      </div>
    </div>
  )
}

export default PreLoader;
