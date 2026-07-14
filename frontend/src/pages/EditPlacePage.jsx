import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import LocationPickerMap from '../components/LocationPickerMap';
import PageLoader from '../components/PageLoader';
import { authStore } from '../stores/authStores';
import { placesStore } from '../stores/placesStore';


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

  useEffect(() => {
    async function loadData() {
      placesStore.clearFormErrors();
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
        image: null,
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

    const formData = new FormData();

    formData.append('category_id', form.category_id);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('address', form.address);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);

    if (form.image) formData.append('image', form.image);

    const success = await placesStore.updatePlace(id, formData);

    if (success) {
      console.log('success', success);

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

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>{t('places.category')}</span>

          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChangeForm}
          >
            <option value="">{t('places.selectCategory')}</option>

            {placesStore.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {placesStore.formErrors?.category_id &&
          <p className="form-error">
            {placesStore.formErrors.category_id.join(' ')}
          </p>
        }

        <label>
          <span>{t('places.title')}</span>

          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChangeForm}
          />
        </label>

        {placesStore.formErrors?.title &&
          <p className="form-error">
            {placesStore.formErrors?.title.join(' ')}
          </p>
        }

        <label>
          <span>{t('places.description')}</span>

          <textarea
            name="description"
            rows="4"
            value={form.description}
            onChange={handleChangeForm}
          />
        </label>

        <label>
          <span>{t('places.address')}</span>

          <input
            name="address"
            type="text"
            value={form.address}
            onChange={handleChangeForm}
          />
        </label>

        {place?.image &&
          <div className="place-edit-image">
            <span>{t('places.currentImage')}</span>
            <img src={place.image} alt={place.title} />
          </div>
        }

        <label>
          <span>{t('places.newImage')}</span>

          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleChangeFile}
          />
        </label>

        {placesStore.formErrors?.image && (
          <p className="form-error">
            {placesStore.formErrors.image.join(' ')}
          </p>
        )}

        <div className="location-picker-field">
          <span className="location-picker-field__label">
            {t('places.pickLocation')}
          </span>

          <LocationPickerMap
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={handleChangeLocation}
          />

          <p className="location-picker-field__hint">
            {t('places.pickLocationHint')}
          </p>
        </div>

        <label>
          <span>{t('places.latitude')}</span>

          <input
            name="latitude"
            type="text"
            value={form.latitude}
            onChange={handleChangeForm}
          />
        </label>

        {placesStore.formErrors?.latitude && (
          <p className="form-error">
            {placesStore.formErrors.latitude.join(' ')}
          </p>
        )}

        <label>
          <span>{t('places.longitude')}</span>

          <input
            name="longitude"
            type="text"
            value={form.longitude}
            onChange={handleChangeForm}
          />
        </label>

        {placesStore.formErrors?.longitude && (
          <p className="form-error">
            {placesStore.formErrors.longitude.join(' ')}
          </p>
        )}

        <button type="submit" disabled={placesStore.isSave}>
          {placesStore.isSave ? t('places.updating') : t('places.update')}
        </button>
      </form>
    </section>
  )
}

export default observer(EditPlacePage);
