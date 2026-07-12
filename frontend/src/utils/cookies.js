export function getCookie(name) {
  const cookies = document.cookie ? document.cookie.split('; ') : [];

  for (const cookie of cookies) {
    const [cookieName, ...cookieValueParts] = cookie.split('=');

    if (cookieName === name) {
      return decodeURIComponent(cookieValueParts.join('='));
    }
  }

  return null;
}