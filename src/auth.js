const TOKEN_KEY = 'jwtToken';
const USER_KEY = 'userInfo';

export const getStoredAuth = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    if (!token) return null;

    return {
      token,
      ...(userRaw ? JSON.parse(userRaw) : {})
    };
  } catch (error) {
    return null;
  }
};

export const setStoredAuth = (credentials) => {
  const { token, userId, username, ...rest } = credentials;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ userId, username, ...rest }));
};

export const clearStoredAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
export const getAuthHeader = () => {
  const token = localStorage.getItem('jwtToken');
  return token ? `Bearer ${token}` : null;
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('jwtToken');
};

export const getStoredUserInfo = () => {
  try {
    return {
      userId: localStorage.getItem('userId'),
      username: localStorage.getItem('username')
    };
  } catch {
    return null;
  }
};