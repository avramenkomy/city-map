import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PlacesFilters from '../components/PlacesFilters';
import PageLoader from '../components/PageLoader';
import PlaceModal from '../components/PlaceModal';
import PlacesMap from '../components/PlacesMap';

import { placesStore } from '../stores/placesStore';
import { authStore } from '../stores/authStore';

function HomePage() {
  const { t } = useTranslation();

  useEffect(() => {
    placesStore.loadPlaces();
    placesStore.loadCategories();
  }, []);


  async function confirmDelete(place_id) {
    const confirmed = window.confirm(t('places.confirmDelete'));

    if (confirmed) {
      await placesStore.deletePlace(place_id);
    }
  }

  if (placesStore.loading) return <PageLoader />

  if (placesStore.error) {
    return (
      <p>
        {t('places.errorPrefix')}: {placesStore.error}
      </p>
    );
  }

  return (
    <main className="page">
      <section className="hero">
        <h1>{t('app.title')}</h1>
        <p>{t('app.subtitle')}</p>
      </section>

      <PlacesFilters />

      <PlacesMap
        places={placesStore.places}
        focusedPlace={placesStore.focusedPlace}
        onPlaceClick={place => placesStore.selectPlace(place)}
      />

      <section className="places-list">
        {!placesStore.hasPlaces
          ? <p>{t('places.empty')}</p>

          : placesStore.places.map((place) => {
              const canManagePlace = authStore.username === place.author_username;

              return <article className="place-card" key={place.id}>
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
                  <button
                    className="place-card__button"
                    type="button"
                    onClick={() => placesStore.selectPlace(place)}
                  >
                    {t('places.details')}
                  </button>

                  <button
                    className="place-card__button place-card__button--secondary"
                    type="button"
                    onClick={() => placesStore.focusPlace(place)}
                  >
                    {t('places.showOnMap')}
                  </button>

                  {canManagePlace &&
                    <>
                      <Link
                        className="place-card__button place-card__button--secondary"
                        to={`/places/${place.id}/edit`}
                      >
                        {t('places.edit')}
                      </Link>

                      <button
                        className="place-card__button place-card__button--danger"
                        type="button"
                        onClick={() => confirmDelete(place.id)}
                      >
                        {t('places.delete')}
                      </button>
                    </>
                  }
                </div>
              </article>
            })
        }
      </section>

      {placesStore.selectedPlace &&
        <PlaceModal
          place={placesStore.selectedPlace}
          onClose={() => placesStore.closePlaceModal()}
        />
      }
    </main>
  );
}

export default observer(HomePage);
