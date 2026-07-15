import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import PageLoader from '../components/PageLoader';
import PlaceForm from '../components/PlaceForm';

import { authStore } from '../stores/authStore';
import { placesStore } from '../stores/placesStore';
import { buildPlaceFormData } from '../utils/placeFormData';
import { validatePlaceImagFile } from '../utils/validatePlaceImageFile';


function EditPlacePage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [place, setPlace] = useState(null);
  const [form, setForm] = useState({
    category_id: '',
    title: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    image: null,
  });
  const [imageErrorKey, setImageErrorKey] = useState(null);

  useEffect(() => {
    async function loadData() {
      placesStore.clearFormErrors();
      setImageErrorKey(null);
      await placesStore.loadCategories();

      const loadedPlace = await placesStore.loadPlace(id);

      if (!loadedPlace) {
        return;
      }

      setPlace(loadedPlace);
      setForm({
        category_id: String(loadedPlace.category?.id || ''),
        title: loadedPlace.title,
        description: loadedPlace.description || '',
        address: loadedPlace.address || '',
        latitude: loadedPlace.latitude || '',
        longitude: loadedPlace.longitude || '',
      });
    }

    loadData();
  }, [id]);

  function handleChangeForm(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }


  function handleChangeFile(event) {
    const file = event.target.files?.[0] || null;
    const errorKey = validatePlaceImagFile(file);

    if (errorKey) {
      setImageErrorKey(errorKey);

      setForm(prevState => ({
        ...prevState,
        image: null,
      }));

      event.target.value = '';
      return;
    }

    setImageErrorKey(null);

    setForm(prevState => ({
      ...prevState,
      image: file,
    }));
  }


  function handleChangeLocation(location) {
    setForm(prevState => ({
      ...prevState,
      latitude: location.latitude,
      longitude: location.longitude,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (imageErrorKey) return;

    const formData = buildPlaceFormData(form);
    const success = await placesStore.updatePlace(id, formData);

    if (success) {
      navigate('/')
    }
  }

  if (!authStore.isAuthChecked) {
    return <PageLoader />
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (placesStore.loading && !place) {
    return <PageLoader />
  }

  if (place && place.author_username !== authStore.username) {
    return <Navigate to="/" replace />
  }

  return (
    <section className="auth-page">
      <h1>{t('places.edit')}</h1>

      <PlaceForm
        form={form}
        categories={placesStore.categories}
        formErrors={placesStore.formErrors}
        imageError={imageErrorKey ? t(imageErrorKey) : null}
        isSave={placesStore.isSave}
        currentImage={place?.image}
        submitLabel={t('places.update')}
        savingLabel={t('places.updating')}
        onSubmit={handleSubmit}
        onChangeForm={handleChangeForm}
        onChangeFile={handleChangeFile}
        onChangeLocation={handleChangeLocation}
      />
    </section>
  )
}

export default observer(EditPlacePage);
