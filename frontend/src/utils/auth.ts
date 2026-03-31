export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
  [key: string]: any;
}

const USER_KEY = 'user';

export const getUser = (): User | null => {
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Failed to parse user from localStorage', error);
    return null;
  }
};

export const setUser = (user: User): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notifyAuthStateChange();
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
  notifyAuthStateChange();
};

// Custom event to allow cross-component reactivity when auth state changes directly
export const notifyAuthStateChange = () => {
  window.dispatchEvent(new Event('auth-change'));
};
