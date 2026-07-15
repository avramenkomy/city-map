import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import LocationPickerMap from './LocationPickerMap';

function PlaceForm(props) {
  const {
    form,
    categories,
    formErrors,
    isSave,
    currentImage,
    submitLabel,
    savingLabel,
    onSubmit,
    onChangeForm,
    onChangeFile,
    onChangeLocation,
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

  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <label>
        <span>{t('places.category')}</span>
        <select
          name="category_id"
          value={form.category_id}
          onChange={onChangeForm}
        >
          <option value="">{t('places.selectCategory')}</option>

          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      {formErrors?.caregory_id &&
        <p className="form-error">
          {formErrors.category_id.join(' ')}
        </p>
      }

      <label>
        <span>{t('places.title')}</span>

        <input
          name="title"
          type="text"
          value={form.title}
          onChange={onChangeForm}
        />
      </label>

      {formErrors?.title &&
        <p className="form-error">
          {formErrors.title.join(' ')}
        </p>
      }

      <label>
        <span>{t('places.description')}</span>

        <textarea
          name="description"
          rows={4}
          value={form.description}
          onChange={onChangeForm}
        />
      </label>


      <label>
        <span>{t('places.address')}</span>

        <input
          name="address"
          type="address"
          value={form.address}
          onChange={onChangeForm}
        />
      </label>

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
        />
      </label>

      {form.image && imagePreviewUrl &&
        <div className="place-edit-image">
          <span>{t('places.selectedImagePreview')}</span>

          <img src={imagePreviewUrl} alt={form.title} />
        </div>
      }

      {formErrors?.image &&
        <p className="form-error">
          {formErrors.image.join(' ')}
        </p>
      }

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
        />
      </label>

      {formErrors?.latitude &&
        <p className="form-error">
          {formErrors.latitude.join(' ')}
        </p>
      }

      <label>
        <span>{t('places.longitude')}</span>
        <input
          name="longitude"
          type="text"
          value={form.longitude}
          onChange={onChangeForm}
        />
      </label>

      {formErrors?.longitude &&
        <p className="form-error">
          {formErrors.longitude.join(' ')}
        </p>
      }

      <button type="submit" disabled={isSave}>
        {isSave ? savingLabel : submitLabel}
      </button>
    </form>
  )
}

export default PlaceForm;
