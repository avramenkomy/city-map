import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { getPlaces } from '../api/placesApi';
import LanguageSwitcher from '../components/LanguageSwitcher';
import ThemeSwitcher from '../components/ThemeSwitcher';
import PreLoader from '../components/PageLoader';

function HomePage() {
  const { t } = useTranslation();

  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPlaces() {
      try {
        const data = await getPlaces();
        setPlaces(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadPlaces();
  }, []);

  if (isLoading) {
    return <PreLoader />;
  }

  if (error) {
    return (
      <p>
        {t('places.errorPrefix')}: {error}
      </p>
    );
  }

  return (
    <main className="page">
      <header className="site-header">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </header>

      <section className="hero">
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
      </section>

      <section className="places-list">
        {places.length === 0 ? (
          <p>{t('places.empty')}</p>
        ) : (
          places.map((place) => (
            <article className="place-card" key={place.id}>
              <h2>{place.title}</h2>
              <p>{place.description || t('places.descriptionFallback')}</p>
              <p>
                {t('places.category')}: {place.category?.name || t('places.withoutCategory')}
              </p>
              <p>
                {t('places.coordinates')}: {place.latitude}, {place.longitude}
              </p>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default HomePage;