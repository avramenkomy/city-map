import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';

import { placesStore } from '../stores/placesStore';
import { authStore } from '../stores/authStore';
import PlacesList from '../components/PlacesList';

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
