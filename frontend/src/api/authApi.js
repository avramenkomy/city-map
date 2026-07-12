import { getCookie } from '../utils/cookies';


async function ensureCsrfCookie() {
  const response = await fetch('/api/auth/csrf', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to prepare CSRF protection.');
  }
}


async function requestJson(url, options={}) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    }
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error('Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}


async function postJson(url, payload={}) {
  await ensureCsrfCookie();

  const csrfToken = getCookie('csrftoken');

  return requestJson(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken || '',
    },
    body: JSON.stringify(payload),
  });
}


export function getCurrentUser() {
  return requestJson('/api/auth/me/');
}


export function registerUser() {
  return postJson('/api/auth/register/');
}


export function loginUser(payload) {
  return postJson('/api/auth/login/', payload);
}


export function logoutUser() {
  return postJson('/api/auth/logout/');
}
