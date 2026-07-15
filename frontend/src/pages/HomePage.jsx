import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PlacesFilters from '../components/PlacesFilters';
import PageLoader from '../components/PageLoader';
import PlaceModal from '../components/PlaceModal';
import PlacesMap from '../components/PlacesMap';
import PlacesList from '../components/PlacesList';

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
    <>
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

      <PlacesList
        places={placesStore.places}
        getCanManagePlace={place => authStore.username === place.author_username}
        showOnMapAction
        onDetails={place => placesStore.selectPlace(place)}
        onShowOnMap={place => placesStore.focusPlace(place)}
        onDelete={confirmDelete}
      />

      {placesStore.selectedPlace &&
        <PlaceModal
          place={placesStore.selectedPlace}
          onClose={() => placesStore.closePlaceModal()}
        />
      }
    </>
  );
}

export default observer(HomePage);
