import { makeAutoObservable, runInAction } from 'mobx';

import {
  createPlace as CreatePlaceRequest, getCategories, getPlaces
} from '../api/placesApi';

class PlaceStore {
  places = [];
  categories = [];

  loading = false;
  isSave = false;

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
      const data = await getPlaces();

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
    try {
      const data = await getCategories();

      runInAction(() => {
        this.categories = data;
      });
    } catch(e) {
      runInAction(() => {
        this.error = e.message;
      });
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
        this.isSave(false);
      });
    }
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
}

export const placesStore = new PlaceStore();
