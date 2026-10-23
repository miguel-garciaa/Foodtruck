import { useColorScheme } from 'react-native';

// Identidad Foodtrucks: superficies limpias y coral propio en ambos temas.
export const themes = {
  light: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    text: '#222222',
    secondaryText: '#626262',
    accent: '#BA3E30',
    softAccent: '#FCEDE9',
    border: '#E5E3DF',
    selected: '#EFEDE9',
    onAccent: '#FFFFFF',
    neutral: '#222222',
    onNeutral: '#FFFFFF',
  },
  dark: {
    background: '#101B2B',
    surface: '#1B293B',
    text: '#FFF9F2',
    secondaryText: '#C2CDDB',
    accent: '#FF9786',
    softAccent: '#3B292D',
    border: '#3D4B5C',
    selected: '#2A394C',
    onAccent: '#101B2B',
    neutral: '#FFF9F2',
    onNeutral: '#101B2B',
  },
};

export const layout = { edge: 24, cardGap: 14, cardRadius: 22, buttonRadius: 16, searchHeight: 50 };
export const motion = { press: 120 };

export function dockHeight(fontScale: number) {
  return 52 + Math.max(0, fontScale - 1) * 40;
}

export function useTheme() {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
