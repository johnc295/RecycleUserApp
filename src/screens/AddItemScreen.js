import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/styles';

export default function AddItemScreen({ navigation }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [recyclabilityStatus, setRecyclabilityStatus] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const recyclabilityOptions = [
    { label: 'Recyclable', value: 'Recyclable' },
    { label: 'Non-Recyclable', value: 'Non-Recyclable' },
  ];

  // Open image picker from gallery
  async function pickImage() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  // Open camera to take photo
  async function takePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  }

  // Upload image to Firebase Storage
  async function uploadImage() {
    if (!image) return null;

    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      
      // Create unique filename with timestamp and user ID
      const imageRef = ref(storage, `items/${Date.now()}_${user.uid}`);
      await uploadBytes(imageRef, blob);
      
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // Handle form submission
  async function handleSubmit() {
    if (!name || !description || !recyclabilityStatus) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Upload image if selected
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

      // Create item data object
      const itemData = {
        name: name.trim(),
        description: description.trim(),
        recyclabilityStatus,
        imageUrl,
        userId: user.uid,
        userEmail: user.email,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date(),
      };

      // Save to Firestore
      await addDoc(collection(db, 'items'), itemData);
      
      Alert.alert('Success', 'Item added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={globalStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Add New Item</Text>

        {/* Item details form */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Item Details</Text>
          
          <TextInput
            style={globalStyles.input}
            placeholder="Item name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            style={globalStyles.input}
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />

          {/* Recyclability status selection */}
          <Text style={[globalStyles.text, { marginTop: 16, marginBottom: 8 }]}>
            Recyclability Status:
          </Text>
          {recyclabilityOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                globalStyles.button,
                globalStyles.buttonOutline,
                recyclabilityStatus === option.value && { backgroundColor: colors.green }
              ]}
              onPress={() => setRecyclabilityStatus(option.value)}
            >
              <Text style={[
                globalStyles.buttonTextOutline,
                recyclabilityStatus === option.value && { color: colors.white }
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Image selection */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Add Photo (Optional)</Text>
          
          {image && (
            <View style={globalStyles.imageContainer}>
              <Image source={{ uri: image.uri }} style={globalStyles.image} />
            </View>
          )}

          <View style={globalStyles.row}>
            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonOutline, { flex: 1, marginRight: 8 }]}
              onPress={pickImage}
            >
              <Ionicons name="images" size={20} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={globalStyles.buttonTextOutline}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.button, globalStyles.buttonOutline, { flex: 1, marginLeft: 8 }]}
              onPress={takePhoto}
            >
              <Ionicons name="camera" size={20} color={colors.green} style={{ marginRight: 8 }} />
              <Text style={globalStyles.buttonTextOutline}>Camera</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit button */}
        <TouchableOpacity
          style={[globalStyles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {loading ? 'Adding Item...' : 'Add Item'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 