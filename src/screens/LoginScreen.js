import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/styles';

export default function LoginScreen({ navigation }) {
  // State variables to store user input and loading status
  const [email, setEmail] = useState('');           // Store the email user types
  const [password, setPassword] = useState('');     // Store the password user types
  const [isLoading, setIsLoading] = useState(false); // Track if login is in progress
  const { login } = useAuth();  // Get the login function from our auth system

  // This function runs when user taps the login button
  async function handleLogin() {
    // Check if user filled in both email and password
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);  // Show loading state (button becomes disabled)
      await login(email, password);  // Try to log in with Firebase
    } catch (error) {
      Alert.alert('Error', error.message);  // Show error if login fails
    } finally {
      setIsLoading(false);  // Hide loading state (button becomes enabled again)
    }
  }

  // This function determines how the keyboard behaves on different phones
  // iPhones and Android phones handle keyboards differently
  function getKeyboardBehavior() {
    if (Platform.OS === 'ios') {
      return 'padding';  // iPhone: add space above keyboard
    } else {
      return 'height';   // Android: adjust screen height
    }
  }

  // This function changes the button text based on loading state
  function getButtonText() {
    if (isLoading) {
      return 'Logging in...';  // Show when login is in progress
    } else {
      return 'Login';          // Show normally
    }
  }

  return (
    // KeyboardAvoidingView prevents keyboard from covering the form
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={getKeyboardBehavior()}
    >
      {/* ScrollView allows content to scroll if it's too tall */}
      <ScrollView contentContainerStyle={globalStyles.screenContainer}>
        {/* App logo and title section */}
        <View style={globalStyles.center}>
          <Ionicons name="leaf" size={80} color={colors.green} />
          <Text style={[globalStyles.title, { marginTop: 16 }]}>
            Recycle?
          </Text>
          <Text style={[globalStyles.text, { textAlign: 'center', marginBottom: 32 }]}>
            Share knowledge about recyclability
          </Text>
        </View>

        {/* Login form section */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Login</Text>
          
          {/* Email input field */}
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}  // Update email state when user types
            keyboardType="email-address"  // Show email keyboard
            autoCapitalize="none"  // Don't capitalize first letter
            autoCorrect={false}    // Don't auto-correct email
          />

          {/* Password input field */}
          <TextInput
            style={globalStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}  // Update password state when user types
            secureTextEntry  // Hide password with dots
            autoCapitalize="none"  // Don't capitalize
            autoCorrect={false}    // Don't auto-correct
          />

          {/* Login button */}
          <TouchableOpacity
            style={[globalStyles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}  // Disable button while loading
          >
            <Text style={globalStyles.buttonText}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>

          {/* Create account button */}
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonOutline]}
            onPress={() => navigation.navigate('Register')}  // Go to register screen
          >
            <Text style={globalStyles.buttonTextOutline}>
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 