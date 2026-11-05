import '@/styles/global.css';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { HeroUINativeProvider } from 'heroui-native';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaListener } from 'react-native-safe-area-context';
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
      {/* Feeds notch / home-bar sizes to Uniwind so pt-safe, pb-safe, etc. work. */}
      <SafeAreaListener
        style={{ flex: 1 }}
        onChange={({ insets }) => Uniwind.updateInsets(insets)}
      >
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
      </SafeAreaListener>
    </GestureHandlerRootView>
  );
}
