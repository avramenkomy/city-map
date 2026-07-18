import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LocationPickerMap from './LocationPickerMap';

import FieldError from './FieldError';


function PlaceForm(props) {
  const {
    form,
    categories,
    formErrors,
    clientErrors,
    isSave,
    currentImage,
    submitLabel,
    savingLabel,
    onSubmit,
    onChangeForm,
    onChangeFile,
    onChangeLocation,
    imageError,
  } = props;

  const { t } = useTranslation();

  const [imagePreview, setImagePreview] = useState(null);

  const imagePreviewUrl = imagePreview && imagePreview?.file === form.image
    ? imagePreview.url
    : null;


  useEffect(() => {
    if (!form.image) {
      return undefined;
    }

    let isCancelled = false;
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      if (!isCancelled) {
        setImagePreview({
          file: form.image,
          url: reader.result,
        });
      }
    });

    reader.readAsDataURL(form.image);

    return () => {
      isCancelled = true;

      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
    }
  }, [form.image]);


  function getClientError(fieldName) {
    return clientErrors?.[fieldName] ? t(clientErrors[fieldName]) : null;
  }


  function getBackendError(fieldName) {
    const error = formErrors?.[fieldName];

    if (error) return null;

    if (Array.isArray(error)) return error.join(' ');

    return error?.toString();
  }


  function getFieldError(fieldName) {
    return getClientError(fieldName) || getBackendError(fieldName);
  }

  const categoryError = getFieldError('category_id');
  const titleError = getFieldError('title');
  const descriptionError = getFieldError('description');
  const addressError = getFieldError('address');
  const imageBackendError = getFieldError('image');
  const latitudeError = getFieldError('latitude');
  const longitudeError = getFieldError('longitude');

  const imageDescriptionIds = [
    imageError ? 'place-image-client-error' : null,
    imageBackendError ? 'place-image-error' : null,
  ].filter(Boolean).join(' ');

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        <span>{t('places.category')}</span>
        <select
          name="category_id"
          value={form.category_id}
          onChange={onChangeForm}
          aria-invalid={Boolean(categoryError)}
          aria-describedby={categoryError ? 'place-category-error' : undefined}
        >
          <option value="">{t('places.selectCategory')}</option>

          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <FieldError
        id="place-category-error"
        name="category_id"
        getFieldError={getFieldError}
      />

      <label>
        <span>{t('places.title')}</span>

        <input
          name="title"
          type="text"
          value={form.title}
          onChange={onChangeForm}
          aria-invalid={Boolean(titleError)}
          aria-describedby={titleError ? 'place-title-error' : undefined}
        />
      </label>

      <FieldError
        id="place-title-error"
        name="title"
        getFieldError={getFieldError}
      />

      <label>
        <span>{t('places.description')}</span>

        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={onChangeForm}
          aria-invalid={Boolean(descriptionError)}
          aria-describedby={descriptionError ? 'place-description-error' : undefined}
        />
      </label>

      <FieldError
        id="place-description-error"
        name="description"
        getFieldError={getFieldError}
      />

      <label>
        <span>{t('places.address')}</span>

        <input
          name="address"
          type="address"
          value={form.address}
          onChange={onChangeForm}
          aria-invalid={Boolean(addressError)}
          aria-describedby={addressError ? 'places-address-error' : undefined}
        />
      </label>

      <FieldError
        id="places-address-error"
        name="address"
        getFieldError={getFieldError}
      />

      {currentImage && !form.image &&
        <div className="place-edit-image">
          <span>{t('places.currentImage')}</span>
          <img src={currentImage} alt={form.title} />
        </div>
      }

      <label>
        <span>
          {currentImage ? t('places.newImage') : t('places.image')}
        </span>

        <input
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onChangeFile}
          aria-invalid={Boolean(imageError || imageBackendError)}
          aria-describedby={imageDescriptionIds || undefined}
        />
      </label>

      {form.image && imagePreviewUrl &&
        <div className="place-edit-image">
          <span>{t('places.selectedImagePreview')}</span>

          <img src={imagePreviewUrl} alt={form.title} />
        </div>
      }

      {imageError &&
        <p className="form-error" id="place-image-client-error" role="alert">
          {imageError}
        </p>
      }

      <FieldError
        id="place-image-error"
        name="image"
        getFieldError={getFieldError}
      />

      <div className="location-picker-field">
        <span className="location-picker-field__label">
          {t('places.pickLocation')}
        </span>

        <LocationPickerMap
          latitude={form.latitude}
          longitude={form.longitude}
          onChange={onChangeLocation}
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
          onChange={onChangeForm}
          aria-invalid={Boolean(latitudeError)}
          aria-describedby={latitudeError ? 'place-latitude-error' : undefined}
        />
      </label>

      <FieldError
        id="place-latitude-error"
        name="latitude"
        getFieldError={getFieldError}
      />

      <label>
        <span>{t('places.longitude')}</span>
        <input
          name="longitude"
          type="text"
          value={form.longitude}
          onChange={onChangeForm}
          aria-invalid={Boolean(longitudeError)}
          aria-describedby={longitudeError ? 'place-longitude-error' : undefined}
        />
      </label>

      <FieldError
        id="place-longitude-error"
        name="longitude"
        getFieldError={getFieldError}
      />

      <button type="submit" disabled={isSave}>
        {isSave ? savingLabel : submitLabel}
      </button>
    </form>
  )
}

export default PlaceForm;
