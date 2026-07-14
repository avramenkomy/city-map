import {
  getJson, postFormData, patchFormData, deleteJson,
} from './client';

export async function getPlaces(filters={}) {
  const params = new URLSearchParams();

  if (filters.category) {
    params.set('category', filters.category);
  }

  if (filters.search) {
    params.set('search', filters.search)
  }

  const queryString = params.toString();
  const url = queryString ? `/api/places/?${queryString}` : '/api/places';

  return getJson(url);
}


export function getPlace(id) {
  return getJson(`/api/places/${id}/`);
}


export async function getCategories() {
  return getJson('/api/categories/');
}


export async function createPlace(formData) {
  return postFormData('/api/places/', formData);
}


export async function updatePlace(id, formData) {
  return patchFormData(`/api/places/${id}/`, formData);
}



export async function deletePlace(id) {
  return deleteJson(`/api/places/${id}/`);
}
