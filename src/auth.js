const AUTH_STORAGE_KEY = 'authCredentials';

export const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (!parsed?.username || !parsed?.password) {
      return null;
    }
    return parsed;
  } catch (error) {
    return null;
  }
};

export const setStoredAuth = (credentials) => {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(credentials));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getBasicAuthHeader = (credentials) => {
  const value = `${credentials.username}:${credentials.password}`;
  return `Basic ${btoa(value)}`;
};

export const isAuthenticated = () => !!getStoredAuth();
