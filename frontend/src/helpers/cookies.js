export function setCookie(name, value, days) {
  let expiresDate = new Date();
  days = days || 90;
  expiresDate.setTime(expiresDate.setTime(expiresDate.getTime() + (days * 24 * 60 * 60 * 1000)));
  document.cookie = name + '=' + value + ';' + `expires=${expiresDate.toUTCString()}` + ';path=/';
}

export function getCookie(name) {
  const decodedCookie = decodeURIComponent(document.cookie),
        cookieArray   = decodedCookie.split(';');
  let cookieValue = null;
  cookieArray.forEach(cookie => {
    let cookieParts = cookie.split('=');
    if (cookieParts[0] === name) cookieValue = cookieParts[1].toString();
  });
  return cookieValue;
}

export function deleteAllCookies() {
  const cookieArray = document.cookie.split(';');
  cookieArray.forEach(cookie => {
    cookie = cookie.split('=');
    setCookie(cookie[0], cookie[1], -1000);
  });
}
