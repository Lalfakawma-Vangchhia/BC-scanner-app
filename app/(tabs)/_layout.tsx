import React, { useEffect, useState } from 'react';
import { Stack, usePathname, useSegments } from 'expo-router';
import { View, StyleSheet, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NavigationBar = () => {
  const [activeTab, setActiveTab] = useState('home');
  const router = useRouter();
  const pathname = usePathname();
  const segments = useSegments();
  const screenWidth = Dimensions.get('window').width;
  const tabWidth = screenWidth / 3;
  const circleSize = 70;
  const barHeight = 70;

  // Check if we're in a protected route
  const isLoggedIn = segments.some(segment => 
    ['NavbarScreen', 'HamburgerScreen', 'ScannerScreen', 'AddManually', 'EditProfileScreen']
      .includes(segment)
  );

  // Update active tab based on current path
  useEffect(() => {
    if (pathname === '/') {
      setActiveTab('home');
    } else if (pathname.includes('/screens/AddManually')) {
      setActiveTab('add');
    } else if (pathname === '/settings') {
      setActiveTab('settings');
    }
  }, [pathname]);

  // Don't show navbar if not logged in
  if (!isLoggedIn) {
    return null;
  }

  const getTabCenter = (tab: string) => {
    switch (tab) {
      case 'home': return tabWidth * 0.5;
      case 'add': return tabWidth * 1.5;
      case 'settings': return tabWidth * 2.5;
      default: return tabWidth * 1.5;
    }
  };

  const circleLeft = getTabCenter(activeTab) - circleSize / 2;

  return (
    <View style={styles.navbarWrapper}>
      {/* Green Bar Background */}
      <View style={styles.navbarBackground} />

      {/* Cutout Circle */}
      <View style={[styles.cutoutCircle, { left: circleLeft }]} />

      {/* Active Icon in Circle */}
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

      {/* Touchable Tabs */}
      <View style={styles.navTabs}>
        <TouchableOpacity 
          onPress={() => {
            setActiveTab('home');
            if (pathname !== '/') {
              router.push('/');
            }
          }} 
          style={styles.navTab}
        >
          {activeTab !== 'home' && (
            <Ionicons
              name="home-outline"
              size={24}
              color="#fff"
            />
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

export default function TabsLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: 'white',
          },
        }}
      />
      <NavigationBar />
    </View>
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
