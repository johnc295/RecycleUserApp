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

export default function RegisterScreen({ navigation }) {
  // State variables to store form data and UI states
  const [email, setEmail] = useState('');                    // Store email user types
  const [password, setPassword] = useState('');              // Store password user types
  const [confirmPassword, setConfirmPassword] = useState(''); // Store password confirmation
  const [loading, setLoading] = useState(false);             // Track if registration is in progress
  const { signup } = useAuth();  // Get the signup function from our auth system

  // This function handles the registration process
  async function handleSignup() {
    // Check if all fields are filled
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Check if password is long enough (Firebase requirement)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);  // Show loading state
      await signup(email, password);  // Create the account with Firebase
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);  // Show error if registration fails
    } finally {
      setLoading(false);  // Hide loading state
    }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={(() => {
        if (Platform.OS === 'ios') {
          return 'padding';
        } else {
          return 'height';
        }
      })()}
    >
      <ScrollView contentContainerStyle={globalStyles.screenContainer}>
        <View style={globalStyles.center}>
          <Ionicons name="leaf" size={80} color={colors.green} />
          <Text style={[globalStyles.title, { marginTop: 16 }]}>
            Join RecycleUserApp
          </Text>
          <Text style={[globalStyles.text, { textAlign: 'center', marginBottom: 32 }]}>
            Start sharing your recyclability knowledge
          </Text>
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Create Account</Text>
          
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

          <TextInput
            style={globalStyles.input}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            style={[globalStyles.button, loading && { opacity: 0.7 }]}
            onPress={handleSignup}
            disabled={loading}
          >
            <Text style={globalStyles.buttonText}>
              {(() => {
                if (loading) {
                  return 'Creating Account...';
                } else {
                  return 'Create Account';
                }
              })()}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonOutline]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={globalStyles.buttonTextOutline}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 