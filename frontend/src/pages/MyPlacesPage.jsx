import { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';

import { placesStore } from '../stores/placesStore';
import { authStore } from '../stores/authStore';

function MyPlacesPage() {
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.isAuthChecked && authStore.isAuthenticated) {
      placesStore.loadMyPlaces();
    }
  }, [authStore.isAuthChecked, authStore.isAuthenticated]);

  if (!authStore.isAuthChecked) {
    return <PageLoader />
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (placesStore.loading) {
    return <PageLoader />
  }


  async function handleDeletePlace(id) {
    const confirmed = window.confirm(t('places.deleteConfirm'));

    if (confirmed) {
      await placesStore.deletePlace(id);
    }
  }

  return (
    <>
      <section className="hero">
        <h1>{t('pages.myPlaces.title')}</h1>
        <p>{t('pages.myPlaces.subtitle')}</p>
      </section>

      <section className="places-list">
        {!placesStore.hasPlaces
          ? <p>{t('places.myPlacesEmpty')}</p>

          : placesStore.places.map(place => (
              <article className="place-card" key={place.id}>
                {place.image &&
                  <img
                    className="place-card__image"
                    src={place.image}
                    alt={place.title}
                  />
                }
                <h2>{place.title}</h2>

                <p>{place.description || t('places.descriptionFallback')}</p>

                <p>
                  {t('places.category')}: {place.category?.name || t('places.withoutCategory')}
                </p>

                <p>
                  {t('places.coordinates')}: {place.latitude}, {place.longitude}
                </p>

                <div className="place-card__actions">
                  <Link
                    className="place-card__button place-card__button--secondary"
                    to={`/places/${place.id}/edit`}
                  >
                    {t('places.edit')}
                  </Link>

                  <button
                    className="place-card__button place-card__button--danger"
                    type="button"
                    onClick={() => handleDeletePlace(place.id)}
                  >
                    {t('places.delete')}
                  </button>
                </div>
              </article>
            ))
        }
      </section>
    </>
  );
}

export default observer(MyPlacesPage);
