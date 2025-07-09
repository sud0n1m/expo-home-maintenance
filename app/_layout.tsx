import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (Platform.OS !== 'web') {
      const cdpApiKey = process.env.EXPO_PUBLIC_CIO_CDP_API_KEY;
      const siteId = process.env.EXPO_PUBLIC_CIO_SITE_ID;
      console.log('Customer.io env:', { cdpApiKey, siteId });
      import('customerio-reactnative').then(({ CustomerIO, CioRegion }) => {
        CustomerIO.initialize({
          cdpApiKey: cdpApiKey || '',
          region: CioRegion.US, // Change to CioRegion.EU if needed
          inApp: {
            siteId: siteId || '',
          },
        });
        console.log('CustomerIO initialized');
        CustomerIO.identify({
          userId: '1',
          traits: {
            first_name: 'Colin',
            last_name: 'N',
            email: 'colin@firecorn.org',
          },
        });
        console.log('CustomerIO identify called');
        CustomerIO.track('test_event', { test: true });
        console.log('CustomerIO track event sent');
      });
    }
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <PaperProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}
