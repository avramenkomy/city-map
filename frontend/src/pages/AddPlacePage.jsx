import { useTranslation } from 'react-i18next';


function AddPlacePage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <h1>{t('pages.addPlace.title')}</h1>
      <p>{t('pages.addPlace.subtitle')}</p>
    </section>
  )
}

export default AddPlacePage;
