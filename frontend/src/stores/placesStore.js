import { makeAutoObservable, runInAction } from 'mobx';

import {
  createPlace as CreatePlaceRequest, getCategories, getPlaces
} from '../api/placesApi';

class PlaceStore {
  places = [];
  categories = [];

  filters = {
    category: '',
    search: '',
  }

  loading = false;
  isSave = false;
  isCategoriesLoading = false;
  categoriesLoaded = false;

  error = null;
  formErrors = null;
  selectedPlace = null;
  focusedPlace = null;

  constructor() {
    makeAutoObservable(this);
  }


  async loadPlaces() {
    this.loading = true;
    this.error = null;

    try {
      const data = await getPlaces(this.filters);

      runInAction(() => {
        this.places = data;
      });
    } catch(error) {
      runInAction(() => {
        this.error = error.message;
      })
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }


  async loadCategories() {
    if (this.isCategoriesLoading || this.categoriesLoaded) {
      return;
    }

    this.isCategoriesLoading = true;

    try {
      const data = await getCategories();

      runInAction(() => {
        this.categories = data;
        this.categoriesLoaded = true;
      });
    } catch(e) {
      runInAction(() => {
        this.error = e.message;
      });
    } finally {
      this.isCategoriesLoading = false;
    }
  }


  async createPlace(payload) {
    this.isSave = true;
    this.error = null;
    this.formErrors = null;

    try {
      const place = await CreatePlaceRequest(payload);

      runInAction(() => {
        this.places = [place, ...this.places];
      });

      return true;
    } catch(e) {
      this.error = e.message;
      this.formErrors = e.data;

      return false;
    } finally {
      runInAction(() => {
        this.isSave = false;
      });
    }
  }


  async setCategoryFilter(category) {
    this.filters.category = category;
    await this.loadPlaces();
  }


  async setSearchFilter(search) {
    this.filters.search = search;
    await this.loadPlaces();
  }


  async resetFilters() {
    this.filters = {
      category: '',
      search: '',
    }

    await this.loadPlaces();
  }


  selectPlace(place) {
    this.selectedPlace = place;
  }


  focusPlace(place) {
    this.focusedPlace = place;
    this.selectedPlace = place;
  }


  closePlaceModal() {
    this.selectedPlace = null;
  }


  get hasPlaces() {
    return this.places.length > 0;
  }


  getHasActiveFilters() {
    return Boolean(this.filters.category || this.filters.search);
  }
}

export const placesStore = new PlaceStore();
