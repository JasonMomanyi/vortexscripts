
import { User, ThemeSettings } from '../types';
import { INITIAL_USER } from './mockData';

const KEYS = {
  USER: 'vortex_user_v1',
  THEME: 'vortex_theme_v1',
  LEGAL: 'vortex_legal_accepted'
};

export const saveUser = (user: User) => {
  try {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user data', e);
  }
};

export const loadUser = (): User => {
  try {
    const data = localStorage.getItem(KEYS.USER);
    return data ? JSON.parse(data) : INITIAL_USER;
  } catch (e) {
    console.error('Failed to load user data', e);
    return INITIAL_USER;
  }
};

export const saveTheme = (theme: ThemeSettings) => {
  try {
    localStorage.setItem(KEYS.THEME, JSON.stringify(theme));
  } catch (e) {
    console.error('Failed to save theme', e);
  }
};

export const loadTheme = (): ThemeSettings | null => {
  try {
    const data = localStorage.getItem(KEYS.THEME);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export const saveLegalAccepted = (accepted: boolean) => {
  try {
    localStorage.setItem(KEYS.LEGAL, JSON.stringify(accepted));
  } catch (e) {
    console.error('Failed to save legal state', e);
  }
};

export const loadLegalAccepted = (): boolean => {
  try {
    const data = localStorage.getItem(KEYS.LEGAL);
    return data ? JSON.parse(data) : false;
  } catch (e) {
    return false;
  }
};
