import { getJson, postFormData } from './client';

export async function getPlaces() {
  return getJson('/api/places');
}


export async function getCategories() {
  return getJson('/api/categories/');
}


export async function createPlace(formData) {
  return postFormData('/api/places/', formData);
}
