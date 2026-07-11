import { useTranslation } from 'react-i18next';


function RegisterPage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <h1>{t('pages.register.title')}</h1>
      <p>{t('pages.register.subtitle')}</p>
    </section>
  )
}

export default RegisterPage;
