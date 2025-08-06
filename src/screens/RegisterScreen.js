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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  async function handleSignup() {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      await signup(email, password);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
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