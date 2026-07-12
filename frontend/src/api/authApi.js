import { getJson, postJson } from './client';


export function getCurrentUser() {
  return getJson('/api/auth/me/');
}


export function registerUser(payload) {
  return postJson('/api/auth/register/', payload);
}


export function loginUser(payload) {
  return postJson('/api/auth/login/', payload);
}


export function logoutUser() {
  return postJson('/api/auth/logout/');
}
