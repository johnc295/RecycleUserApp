import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/styles';

export default function ProfileScreen({ navigation }) {
  const { user, logout, resetPassword } = useAuth();

  async function handleLogout() {
    console.log('Logout button pressed');
    try {
      console.log('Attempting logout...');
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to logout. Please try again.');
      }
    }
  }

  async function handleResetPassword() {
    try {
      await resetPassword(user.email);
      if (typeof window !== 'undefined') {
        window.alert('Password reset email sent! Check your inbox.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      if (typeof window !== 'undefined') {
        window.alert('Failed to send password reset email. Please try again.');
      }
    }
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Profile</Text>

        {/* User Info Card */}
        <View style={globalStyles.card}>
          <View style={globalStyles.center}>
            <View style={[globalStyles.avatar, { backgroundColor: colors.green }]}>
              <Ionicons name="person" size={32} color={colors.white} />
            </View>
            <Text style={[globalStyles.subtitle, { marginTop: 16 }]}>
              {user.email}
            </Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Account</Text>
          
          <TouchableOpacity
            style={[globalStyles.button, globalStyles.buttonOutline, { marginBottom: 12 }]}
            onPress={handleResetPassword}
          >
            <Ionicons name="key" size={20} color={colors.green} style={{ marginRight: 8 }} />
            <Text style={globalStyles.buttonTextOutline}>Reset Password</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[globalStyles.button, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <Ionicons name="log-out" size={20} color={colors.white} style={{ marginRight: 8 }} />
            <Text style={globalStyles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>About Recycle?</Text>
          <Text style={globalStyles.text}>
            The purpose of this app is for users to share knowledge on packaging of everyday items which we purchase and their recyclability
          </Text>
          <Text style={[globalStyles.text, { marginTop: 8 }]}>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 