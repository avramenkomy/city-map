import { getJson, postJson } from './client';

export async function getPlaces() {
  return getJson('/api/places');
}


export async function getCategories() {
  return getJson('/api/categories/');
}


export async function createPlace(payload) {
  return postJson('/api/places/', payload);
}
