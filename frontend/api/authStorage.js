const TOKEN_KEY = 'accessToken';
const USER_NAME_KEY = 'userName';

export function saveAuth({ accessToken, userName }) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_NAME_KEY, userName);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserName() {
  return localStorage.getItem(USER_NAME_KEY);
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_NAME_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}