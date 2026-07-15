import { useTranslation } from 'react-i18next';

import PlaceCard from './PlaceCard';

function PlacesList(props) {
  const {
    places,
    emptyText,
    getCanManagePlace,
    showMapAction=true,
    onDetails,
    onShowOnMap,
    onDelete
  } = props;

  const { t } = useTranslation();

  if (!places.length) {
    return <section className="places-list">
      <p>{emptyText || t('places.empty')}</p>
    </section>
  }

  return (
    <section className="places-list">
      {places.map(place => (
        <PlaceCard
          key={place.id}
          place={place}
          canManage={getCanManagePlace ? getCanManagePlace(place) : false}
          showMapAction={showMapAction}
          onDetails={onDetails}
          onShowOnMap={onShowOnMap}
          onDelete={onDelete}
        />
      ))}
    </section>
  )
}

export default PlacesList;