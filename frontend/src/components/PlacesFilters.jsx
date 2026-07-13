import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

import { placesStore } from '../stores/placesStore';


function PlacesFilters() {
  const { t } = useTranslation();


  function handleCategoryFilterOnChange(event) {
    placesStore.setCategoryFilter(event.target.value);
  }


  function handleSearchOnChange(event) {
    placesStore.setSearchFilter(event.target.value);
  }


  function resetFilters() {
    placesStore.resetFilters();
  }

  return (
    <section className="places-filters" aria-label={t('places.filters')}>
      <label>
        <span>{t('places.category')}</span>

        <select
          value={placesStore.filters.category}
          onChange={handleCategoryFilterOnChange}
        >
          <option value="">{t('places.allCategories')}</option>

          {placesStore.categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>{t('places.search')}</span>

        <input
          type="search"
          value={placesStore.filters.search}
          placeholder={t('places.searchPlaceholder')}
          onChange={handleSearchOnChange}
        />
      </label>

      {placesStore.getHasActiveFilters &&
        <button type="button" onClick={resetFilters}>
          {t('places.resetFilters')}
        </button>
      }
    </section>
  )
}

export default observer(PlacesFilters);
