import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


function PlaceCard(props) {
  const {
    place, canManage, showMapAction, onDetails, onShowOnMap, onDelete
  } = props;

  const { t } = useTranslation();

  return (
    <article className="place-card">
      {place.image &&
        <img
          className="place-card__image"
          src={place.image}
          alt={place.title}
        />
      }

      <h2>{place.title}</h2>

      <p>
        {t('places.category')}: {place.category?.name || t('place.withoutCategory')}
      </p>

      <p>
        {t('places.coordinates')}: {place.latitude}, {place.longitude}
      </p>

      <div className="place-card__actions">
        {onDetails &&
          <button
            className="place-card__button"
            type="button"
            onClick={() => onDetails(place)}
          >
            {t('places.details')}
          </button>
        }

        {showMapAction && onShowOnMap &&
          <button
            type="button"
            className="place-card__button place-card__button--secondary"
            onClick={() => onShowOnMap(place)}
          >
            {t('places.showOnMap')}
          </button>
        }

        {canManage &&
          <>
            <Link
              className="place-card__button place-card__button--secondary"
              to={`/places/${place.id}/edit`}
            >
              {t('places.edit')}
            </Link>

            <button
              type="button"
              className="place-card__button place-card__button--danger"
              onClick={() => onDelete(place)}
            >
              {t('places.delete')}
            </button>
          </>
        }
      </div>
    </article>
  )
}

export default PlaceCard;
