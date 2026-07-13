import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { authStore } from '../stores/authStores';
import { placesStore } from '../stores/placesStore';

import PageLoader from '../components/PageLoader';
import LocationPickerMap from '../components/LocationPickerMap';


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
  });

  useEffect(() => {
    placesStore.loadCategories();
  }, []);


  function handleChange(event) {
    const { name, value } = event.target;

    setForm(prevState => ({
      ...prevState,
      [name]: value,
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

    const success = await placesStore.createPlace(form);

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

      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          <span>{t('places.category')}</span>
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
          >
            <option value="">{t('places.selectCategory')}</option>

            {placesStore.categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        {placesStore.formErrors?.caregory_id &&
          <p className="form-error">
            {placesStore.formErrors.category_id.join(' ')}
          </p>
        }

        <label>
          <span>{t('places.title')}</span>

          <input
            name="title"
            type="text"
            value={form.title}
            onChange={handleChange}
          />
        </label>

        {placesStore.formErrors?.title &&
          <p className="form-error">
            {placesStore.formErrors.title.join(' ')}
          </p>
        }

        <label>
          <span>{t('places.description')}</span>

          <textarea
            name="description"
            rows={4}
            value={form.description}
            onChange={handleChange}
          />
        </label>


        <label>
          <span>{t('places.address')}</span>

          <input
            name="address"
            type="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <div className="location-picker-field">
          <span className="location-picker-field__label">
            {t('places.pickLocation')}
          </span>

          <LocationPickerMap
            latitude={form.latitude}
            longitude={form.longitude}
            onChange={handleLocationChange}
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
            onChange={handleChange}
          />
        </label>

        {placesStore.formErrors?.latitude &&
          <p className="form-error">
            {placesStore.formErrors.latitude.join(' ')}
          </p>
        }

        <label>
          <span>{t('places.longitude')}</span>
          <input
            name="longitude"
            type="text"
            value={form.longitude}
            onChange={handleChange}
          />
        </label>

        {placesStore.formErrors?.longitude &&
          <p className="form-error">
            {placesStore.formErrors.longitude.join(' ')}
          </p>
        }

        <button type="submit" disabled={placesStore.isSave}>
          {placesStore.isSave ? t('places.saving') : t('places.create')}
        </button>
      </form>
    </section>
  )
}

export default observer(AddPlacePage);
