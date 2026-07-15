import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function RegisterPage() {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <h1>{t('pages.notFound.title')}</h1>
      <p>{t('pages.notFound.subtitle')}</p>

      <Link className="text-link" to="/">
        {t('pages.notFound.backhome')}
      </Link>
    </section>
  )
}

export default RegisterPage;
