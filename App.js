import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import StatusScreen from './src/screens/StatusScreen';
import SavedScreen from './src/screens/SavedScreen';
import AboutScreen from './src/screens/AboutScreen';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

const Tab = createBottomTabNavigator();

export default function App() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#075E54" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Status') {
              iconName = focused ? 'images' : 'images-outline';
            } else if (route.name === 'Salvos') {
              iconName = focused ? 'download' : 'download-outline';
            } else if (route.name === 'Sobre') {
              iconName = focused ? 'information-circle' : 'information-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#25D366',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#075E54',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Status" 
          component={StatusScreen}
          options={{ title: 'Status do WhatsApp' }}
        />
        <Tab.Screen 
          name="Salvos" 
          component={SavedScreen}
          options={{ title: 'Arquivos Salvos' }}
        />
        <Tab.Screen 
          name="Sobre" 
          component={AboutScreen}
          options={{ title: 'Sobre o App' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
