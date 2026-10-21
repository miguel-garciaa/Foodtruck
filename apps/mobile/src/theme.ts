import { useColorScheme } from 'react-native';

// Tokens provisionales basados en la dirección marfil/coral/azul noche de doc05.
export const themes = {
  light: {
    background: '#FAF9F6',
    surface: '#FFFFFF',
    text: '#222222',
    secondaryText: '#626262',
    accent: '#BA3E30',
    softAccent: '#FCEDE9',
    border: '#E5E3DF',
    selected: '#EFEDE9',
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
  },
};

export function useTheme() {
  return themes[useColorScheme() === 'dark' ? 'dark' : 'light'];
}
