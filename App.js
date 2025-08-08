import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// Import all the screens (pages) of our app
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddItemScreen from './src/screens/AddItemScreen';
import SearchScreen from './src/screens/SearchScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ItemDetailScreen from './src/screens/ItemDetailScreen';

// Import our authentication system
import { AuthProvider, useAuth } from './src/context/AuthContext';

// Create navigation containers - these help us move between screens
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// This creates the bottom tab navigation (Home, Search, Add Item, Profile)
// Only logged-in users see this
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // This function creates the icons for each tab
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Choose the right icon for each tab
          // 'focused' means the tab is currently selected
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Add Item') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        // Style the tab bar (bottom navigation)
        tabBarActiveTintColor: '#4CAF50',    // Green color for selected tab
        tabBarInactiveTintColor: 'gray',     // Gray color for unselected tabs
        headerStyle: {
          backgroundColor: '#4CAF50',         // Green header
        },
        headerTintColor: '#fff',             // White text in header
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      {/* Define all the tabs and which screen they show */}
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Add Item" component={AddItemScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// This is the main navigation controller
// It decides whether to show login screens or the main app
function Navigation() {
  const { user } = useAuth();  // Check if user is logged in

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // If user is logged in, show the main app with tabs
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
        </>
      ) : (
        // If user is not logged in, show login/register screens
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// This is the main App component - the entry point of our app
export default function App() {
  return (
    // AuthProvider wraps our entire app to provide authentication
    <AuthProvider>
      {/* NavigationContainer is required for React Navigation to work */}
      <NavigationContainer>
        <Navigation />
        {/* StatusBar controls the top bar of the phone */}
        <StatusBar style="light" />
      </NavigationContainer>
    </AuthProvider>
  );
} 