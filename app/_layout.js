import { View } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import Footer from './components/footer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';

const Layout = () => {
  const { pathname } = useRouter();  // Use router to get current path

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <View style={{ flex: 1 }}>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="home/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="home/image"
              options={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="favorites/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="upload/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="profile/index"
              options={{
                headerShown: false,
              }}
            />
          </Stack>

          {pathname !== '/welcome' && <Footer />}
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default Layout;
