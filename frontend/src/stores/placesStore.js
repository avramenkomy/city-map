import { makeAutoObservable, runInAction } from 'mobx';

import {
  getCategories,

  getPlaces, getPlace,

  createPlace as CreatePlaceRequest,
  updatePlace as updatePlaceRequest,
  deletePlace as deletePlaceRequest,
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


  async loadPlace(id) {
    this.loading = true;
    this.error = null;

    try {
      const place = await getPlace(id);
      return place;
    } catch(e) {
      runInAction(() => this.error = e.message);
      return null;
    } finally {
      runInAction(() => this.loading = false);
    }
  }


  async updatePlace(id, payload) {
    this.isSave = true;
    this.error = null;
    this.formErrors = null;

    try {
      const updatedPlace = await updatePlaceRequest(id, payload);

      runInAction(() => {
        this.places = this.places.map(place => (
          place.id === updatedPlace.id ? updatedPlace : place
        ));

        if (this.selectedPlace.id === updatedPlace.id) {
          this.selectedPlace = updatedPlace;
        }

        if (this.focusedPlace.id === updatedPlace) {
          this.focusedPlace = updatedPlace;
        }
      });

      return true;
    } catch(e) {
      runInAction(() => {
        this.formErrors = e.data;
        this.error = e.message;
      });

      return false;
    } finally {
      runInAction(() => {
        this.isSave = false;
      });
    }
  }


  async deletePlace(id) {
    this.isSave = true;
    this.error = null;

    try {
      await deletePlaceRequest(id);

      runInAction(() => {
        this.places = this.places.filter(place => place.id !== id);

        if (this.selectedPlace.id === id) this.selectedPlace = null;

        if (this.focusedPlace === id) this.focusedPlace = null;
      });
      return true;

    } catch(e) {
      runInAction(() => this.error = e.message);
    } finally {
      runInAction(() => this.isSave = false);
    }
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


  clearFormErrors() {
    this.formErrors = null;
    this.error = null;
  }


  get hasPlaces() {
    return this.places.length > 0;
  }


  getHasActiveFilters() {
    return Boolean(this.filters.category || this.filters.search);
  }
}

export const placesStore = new PlaceStore();
