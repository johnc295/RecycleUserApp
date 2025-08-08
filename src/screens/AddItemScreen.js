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
  // State variables to store form data and UI states
  const [name, setName] = useState('');                    // Store item name
  const [description, setDescription] = useState('');      // Store item description
  const [recyclabilityStatus, setRecyclabilityStatus] = useState(''); // Store recyclable/non-recyclable
  const [image, setImage] = useState(null);               // Store selected image
  const [loading, setLoading] = useState(false);          // Track if form is being submitted
  const { user } = useAuth();  // Get current user info

  // Options for recyclability status - user must choose one
  const recyclabilityOptions = [
    { label: 'Recyclable', value: 'Recyclable' },
    { label: 'Non-Recyclable', value: 'Non-Recyclable' },
  ];

  // This function opens the photo gallery to select an image
  async function pickImage() {
    // Ask for permission to access photo gallery
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    // Open the photo gallery
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Only show images, not videos
      allowsEditing: true,                              // Allow user to crop/edit image
      aspect: [4, 3],                                  // Set aspect ratio to 4:3
      quality: 0.8,                                    // Compress image to 80% quality
    });

    // If user selected an image (didn't cancel)
    if (!result.canceled) {
      setImage(result.assets[0]);  // Save the selected image
    }
  }

  // This function opens the camera to take a new photo
  async function takePhoto() {
    // Ask for permission to use camera
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    // Open the camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,  // Allow user to crop/edit photo
      aspect: [4, 3],      // Set aspect ratio to 4:3
      quality: 0.8,        // Compress photo to 80% quality
    });

    // If user took a photo (didn't cancel)
    if (!result.canceled) {
      setImage(result.assets[0]);  // Save the taken photo
    }
  }

  // This function uploads the selected image to Firebase Storage
  async function uploadImage() {
    if (!image) return null;  // If no image selected, return null

    try {
      // Convert image to a format we can upload
      const response = await fetch(image.uri);
      const blob = await response.blob();
      
      // Create unique filename with timestamp and user ID
      const imageRef = ref(storage, `items/${Date.now()}_${user.uid}`);
      await uploadBytes(imageRef, blob);  // Upload the image
      
      return await getDownloadURL(imageRef);  // Get the download URL
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  // This function handles the form submission
  async function handleSubmit() {
    // Check if all required fields are filled
    if (!name || !description || !recyclabilityStatus) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);  // Show loading state
      
      // Upload image if one was selected
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

      // Create the item data object to save to database
      const itemData = {
        name: name.trim(),                    // Item name
        description: description.trim(),      // Item description
        recyclabilityStatus,                  // Recyclable or non-recyclable
        imageUrl,                            // URL of uploaded image (if any)
        userId: user.uid,                    // ID of user who created the item
        userEmail: user.email,               // Email of user who created the item
        upvotes: 0,                          // Start with 0 upvotes
        downvotes: 0,                        // Start with 0 downvotes
        createdAt: new Date(),               // When the item was created
      };

      // Save the item to the Firestore database
      await addDoc(collection(db, 'items'), itemData);
      
      // Show success message and go back to home screen
      Alert.alert('Success', 'Item added successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Home') }
      ]);
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item. Please try again.');
    } finally {
      setLoading(false);  // Hide loading state
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