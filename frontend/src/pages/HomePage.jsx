import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';
import PlaceModal from '../components/PlaceModal';
import PlacesMap from '../components/PlacesMap';
import { placesStore } from '../stores/placesStore';

function HomePage() {
  const { t } = useTranslation();

  useEffect(() => {
    placesStore.loadPlaces();
  }, []);

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

      <PlacesMap
        places={placesStore.places}
        focusedPlace={placesStore.focusedPlace}
        onPlaceClick={place => placesStore.selectPlace(place)}
      />

      <section className="places-list">
        {!placesStore.hasPlaces
          ? <p>{t('places.empty')}</p>

          : placesStore.places.map((place) => (
              <article className="place-card" key={place.id}>
                <h2>{place.title}</h2>
                <p>{place.description || t('places.descriptionFallback')}</p>
                <p>
                  {t('places.category')}: {place.category?.name || t('places.withoutCategory')}
                </p>
                <p>
                  {t('places.coordinates')}: {place.latitude}, {place.longtitude}
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
                </div>
              </article>
            ))
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
