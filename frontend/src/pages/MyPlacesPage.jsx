import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';

import { placesStore } from '../stores/placesStore';
import PlacesList from '../components/PlacesList';

function MyPlacesPage() {
  const { t } = useTranslation();

  useEffect(() => {
    placesStore.loadMyPlaces();
  }, []);

  if (placesStore.loading) {
    return <PageLoader />
  }

  if (placesStore.error) {
    return <p>
      {t('places.errorPrefix')}: {placesStore.error}
    </p>
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

      <PlacesList
        places={placesStore.places}
        emtyText={t('places.myPlacesEmpty')}
        getCanManagePlace={() => true}
        showMapAction={false}
        onDelete={handleDeletePlace}
      />
    </>
  );
}

export default observer(MyPlacesPage);
