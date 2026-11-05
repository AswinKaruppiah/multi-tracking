import '@/styles/global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Uniwind } from 'uniwind';

import { LocationProvider } from '@/context/LocationContext';
import { fonts } from '@/styles/fonts';
import { colors } from '@/styles/theme';

SplashScreen.preventAutoHideAsync();
// Light theme only — HeroUI reads its colors from the Uniwind theme.
Uniwind.setTheme('light');

export default function RootLayout() {
  const [loaded, error] = useFonts(fonts);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <HeroUINativeProvider>
        <LocationProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.brand.gray },
            }}
          />
        </LocationProvider>
      </HeroUINativeProvider>
    </GestureHandlerRootView>
  );
}
