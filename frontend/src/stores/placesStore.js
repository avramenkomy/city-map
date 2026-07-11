import { makeAutoObservable, runInAction } from 'mobx';

import { getPlaces } from '../api/placesApi';

class PlaceStore {
  places = [];
  loading = false;
  error = null;
  selectedPlace = null;

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

  selectPlace(place) {
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
