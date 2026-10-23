import { useState } from 'react';
import { Alert } from 'react-native';
import { usePreventRemove } from 'expo-router/react-navigation';

export function useExitGuard(dirty: boolean, busy: boolean) {
  const [permitted, setPermitted] = useState(false);
  const disablePrevention = usePreventRemove((dirty || busy) && !permitted, ({ repeat }) => {
    if (busy) {
      Alert.alert('Un momento', 'Espera a que termine la operación antes de salir.');
      return;
    }
    Alert.alert(
      'Hay cambios sin guardar',
      'Puedes seguir editando o descartar los cambios de este paso.',
      [
        { text: 'Seguir editando', style: 'cancel' },
        {
          text: 'Descartar y salir',
          style: 'destructive',
          onPress: () => {
            setPermitted(true);
            repeat();
          },
        },
      ],
    );
  });
  return (action: () => void) => {
    setPermitted(true);
    disablePrevention();
    action();
  };
}
