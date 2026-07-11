import { useTranslation } from 'react-i18next';


function LoginPage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <h1>{t('pages.login.title')}</h1>
      <p>{t('pages.login.subtitle')}</p>
    </section>
  )
}

export default LoginPage;
