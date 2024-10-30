const TOKEN_KEY = 'auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

// Để tương thích với code cũ
export const getToken = getStoredToken;
export const setToken = setStoredToken;
export const removeToken = removeStoredToken; 