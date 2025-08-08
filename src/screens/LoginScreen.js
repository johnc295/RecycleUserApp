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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Handle login button 
  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Get keyboard behavior based on platform
  function getKeyboardBehavior() {
    if (Platform.OS === 'ios') {
      return 'padding';
    } else {
      return 'height';
    }
  }

  // Get button text based on loading state
  function getButtonText() {
    if (isLoading) {
      return 'Logging in...';
    } else {
      return 'Login';
    }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={getKeyboardBehavior()}
    >
      <ScrollView contentContainerStyle={globalStyles.screenContainer}>
        {/* App logo and title */}
        <View style={globalStyles.center}>
          <Ionicons name="leaf" size={80} color={colors.green} />
          <Text style={[globalStyles.title, { marginTop: 16 }]}>
            Recycle?
          </Text>
          <Text style={[globalStyles.text, { textAlign: 'center', marginBottom: 32 }]}>
            Share knowledge about recyclability
          </Text>
        </View>

        {/* Login form */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Login</Text>
          
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[globalStyles.button, isLoading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={globalStyles.buttonText}>
              {getButtonText()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonOutline]}
            onPress={() => navigation.navigate('Register')}
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