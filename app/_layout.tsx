import '../global.css';
import React, { useEffect, useState } from 'react';
import { Stack, usePathname, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Add this at the top level of the file
const isAuthRoute = (path: string) => {
  return path === '/login' || path === '/register' || path === '/forgot-password';
};

interface Route {
  name: string;
  params?: Record<string, any>;
}

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / 3;
  const circleSize = 70;
  const barHeight = 70;

  // Move hook to top, always execute
  const isLoggedIn = segments.some(segment =>
    [
      'NavbarScreen',
      'HamburgerScreen',
      'ScannerScreen',
      'AddManually',
      'EditProfileScreen',
      'settings'  // ✅ Add this line
    ].includes(segment)
  );
  

  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('home');
    } else if (pathname.includes('/screens/AddManually')) {
      setActiveTab('add');
    } else if (pathname === '/settings') {
      setActiveTab('settings');
    }
  }, [pathname]);

  const getTabCenter = (tab: string) => {
    switch (tab) {
      case 'home': return tabWidth * 0.5;
      case 'add': return tabWidth * 1.5;
      case 'settings': return tabWidth * 2.5;
      default: return tabWidth * 1.5;
    }
  };

  const circleLeft = getTabCenter(activeTab) - circleSize / 2;

  // ✅ Now safely conditionally render JSX
  if (!isLoggedIn) {
    return <></>;
  }

  return (
    <View style={styles.navbarWrapper}>
      <View style={styles.navbarBackground} />
      <View style={[styles.cutoutCircle, { left: circleLeft }]} />
      <View style={[styles.activeIconCircle, { left: circleLeft }]}>
        <Ionicons
          name={
            activeTab === 'home'
              ? 'home'
              : activeTab === 'add'
              ? 'add-outline'
              : 'settings'
          }
          size={28}
          color="#fff"
        />
      </View>
      <View style={styles.navTabs}>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('home');
            if (pathname !== '/screens/NavbarScreen') {
              router.push('/screens/NavbarScreen');
            }
          }}
          
          style={styles.navTab}
        >
          {activeTab !== 'home' && (
            <Ionicons name="home-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('add');
            router.push('/screens/AddManually');
          }}
          style={styles.navTab}
        >
          {activeTab !== 'add' && (
            <Ionicons name="add-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('settings');
            router.push('/settings');
          }}
          style={styles.navTab}
        >
          {activeTab !== 'settings' && (
            <Ionicons name="settings-outline" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function RootLayout() {
  const [dimensions, setDimensions] = useState(() => Dimensions.get('window'));
  const { width } = dimensions;
  const isDesktop = Platform.OS === 'web' && width > 768;
  const isWeb = Platform.OS === 'web';

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        await Camera.requestCameraPermissionsAsync();
      }
    })();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      let viewportMeta = document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta') as HTMLMetaElement;
        viewportMeta.setAttribute('name', 'viewport');
        document.head.appendChild(viewportMeta);
      }
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        setDimensions(Dimensions.get('window'));
      };

      window.addEventListener('resize', handleResize);
      handleResize();
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="screens" options={{ headerShown: false }} />
      </Stack>
      <NavigationBar />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  navbarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 100,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  navbarBackground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    backgroundColor: '#8AC041',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    zIndex: 1,
  },
  cutoutCircle: {
    position: 'absolute',
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f8f9fa',
    zIndex: 2,
  },
  activeIconCircle: {
    position: 'absolute',
    bottom: 40,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#8AC041',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  navTabs: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    zIndex: 4,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
