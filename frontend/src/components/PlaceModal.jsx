import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function PlaceModal({ place, onClose }) {
  const { t } = useTranslation();

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });


  function handleOverlayClick(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <section
        className="place-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-modal-title"
      >
        <button
          className="place-modal__close"
          type="button"
          onClick={onClose}
        >
          {t('places.close')}
        </button>

        <h2 id="place-modal-title">{place.title}</h2>

        <p className="place-modal__description">
          {place.description || t('places.descriptionFallback')}
        </p>

        <dl className="place-modal__details">
          <div>
            <dt>{t('places.category')}</dt>
            <dd>{place.category?.name || t('places.withoutCategory')}</dd>
          </div>

          <div>
            <dt>{t('places.address')}</dt>
            <dd>{place.address || '-'}</dd>
          </div>

          <div>
            <dt>{t('places.coordinates')}</dt>
            <dd>{`${place.latitude}, ${place.longitude}`}</dd>
          </div>

          <div>
            <dt>{t('places.author')}</dt>
            <dd>{place.author_username || '-'}</dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export default PlaceModal;
