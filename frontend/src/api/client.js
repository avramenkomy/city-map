import { getCookie } from '../utils/cookies';

export async function ensureCsrfCookie() {
  const response = await fetch('/api/auth/csrf/', {
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Failed to prepare CSRF protection.');
  }
}


export async function requestJson(url, options={}) {
  const response = await fetch(url, {
    credentials: 'include',
    ...options,
    headers: {
      ...(options.headers || {})
    }
  });

  const contentType = response.headers.get('content-type') || '';

  const data = contentType.includes('application/json')
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error('Request failed.');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}


export function getJson(url) {
  return requestJson(url);
}


export async function postJson(url, payload={}) {
  await ensureCsrfCookie();

  const csrfToken = getCookie('csrftoken');

  return requestJson(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken || '',
    },
    body: JSON.stringify(payload),
  });
}


export async function postFormData(url, formData) {
  await ensureCsrfCookie();

  const csrfToken = getCookie('csrftoken');

  return requestJson(url, {
    method: 'POST',
    headers: {
      'X-CSRFToken': csrfToken || '',
    },
    body: formData,
  })
}


export async function patchFormData(url, formData) {
  await ensureCsrfCookie();

  const csrfToken = getCookie('csrftoken');

  return requestJson(url, {
    method: 'PATCH',
    headers: {
      'X-CSRFToken': csrfToken || '',
    },
    body: formData,
  });
}


export async function deleteJson(url) {
  await ensureCsrfCookie();

  const csrfToken = getCookie('csrftoken');

  return requestJson(url, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': csrfToken || '',
    },
  });
}
