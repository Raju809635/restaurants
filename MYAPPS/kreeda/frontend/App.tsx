import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Web-specific CSS import
if (Platform.OS === 'web') {
  require('./web/web.css');
}

// Import components
import { ErrorBoundary } from './context/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

// Import screens
import HomeScreen from './screens/HomeScreen';
import NewsScreen from './screens/NewsScreen';
import SportsInfoScreen from './screens/SportsInfoScreen';
import ProfileScreen from './screens/ProfileScreen';
import AchievementsScreen from './screens/AchievementsScreen';

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      try {
        // Add any necessary initialization here
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (error) {
        console.error('App initialization error:', error);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading Krida Sports..." />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator 
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#FF6B35',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="Home" 
                component={HomeScreen}
                options={{ title: 'Krida Sports' }}
              />
              <Stack.Screen 
                name="News" 
                component={NewsScreen}
                options={{ title: 'Sports News' }}
              />
              <Stack.Screen 
                name="SportsInfo" 
                component={SportsInfoScreen}
                options={{ title: 'Sports Info' }}
              />
              <Stack.Screen 
                name="Profile" 
                component={ProfileScreen}
                options={{ title: 'Profile' }}
              />
              <Stack.Screen 
                name="Achievements" 
                component={AchievementsScreen}
                options={{ title: 'Achievements' }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}


