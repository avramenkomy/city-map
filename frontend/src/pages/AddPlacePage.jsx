import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';
import PlaceForm from '../components/PlaceForm';

import { authStore } from '../stores/authStore';
import { placesStore } from '../stores/placesStore';
import { buildPlaceFormData } from '../utils/placeFormData';


function AddPlacePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    category_id: '',
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
  });

  useEffect(() => {
    placesStore.clearFormErrors();
    placesStore.loadCategories();
  }, []);


  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }


  function handleChangeFile(event) {
    const file = event.target.files?.[0] || null;

    setForm(prevState => ({
      ...prevState,
      image: file,
    }));
  }


  function handleLocationChange(location) {
    setForm(prevState => ({
      ...prevState,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const formData = buildPlaceFormData(form);
    const success = await placesStore.createPlace(formData);

    if (success) navigate('/');
  }

  if (!authStore.isAuthChecked) {
    return <PageLoader />
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <section className="auth-page">
      <h1>{t('pages.addPlace.title')}</h1>
      <p>{t('pages.addPlace.subtitle')}</p>

      <PlaceForm
        form={form}
        categories={placesStore.categories}
        formErrors={placesStore.formErrors}
        isSave={placesStore.isSave}
        currentImage={null}
        submitLabel={t('places.create')}
        savingLabel={t('places.saving')}
        onSubmit={handleSubmit}
        onChangeForm={handleChange}
        onChangeFile={handleChangeFile}
        onChangeLocation={handleLocationChange}
      />
    </section>
  )
}

export default observer(AddPlacePage);
