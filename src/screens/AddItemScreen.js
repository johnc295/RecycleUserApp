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

  async function uploadImage() {
    if (!image) return null;

    try {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      
      const imageRef = ref(storage, `items/${Date.now()}_${user.uid}`);
      await uploadBytes(imageRef, blob);
      
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  async function handleSubmit() {
    if (!name || !description || !recyclabilityStatus) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrl = null;
      if (image) {
        imageUrl = await uploadImage();
      }

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
      behavior={(() => {
        if (Platform.OS === 'ios') {
          return 'padding';
        } else {
          return 'height';
        }
      })()}
    >
      <ScrollView style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Add New Item</Text>

        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Item Information</Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Item name"
            value={name}
            onChangeText={setName}
            maxLength={100}
          />

          <TextInput
            style={[globalStyles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Description (how to recycle, materials, etc.)"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={500}
          />

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
                recyclabilityStatus === option.value && globalStyles.buttonText
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Item Image</Text>
          
          {image ? (
            <View>
              <Image source={{ uri: image.uri }} style={globalStyles.image} />
              <TouchableOpacity
                style={[globalStyles.button, globalStyles.buttonSecondary, { marginTop: 8 }]}
                onPress={() => setImage(null)}
              >
                <Text style={globalStyles.buttonText}>Remove Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[globalStyles.row, { justifyContent: 'space-around' }]}>
              <TouchableOpacity
                style={[globalStyles.button, globalStyles.buttonOutline]}
                onPress={pickImage}
              >
                <Ionicons name="images" size={24} color={colors.green} />
                <Text style={globalStyles.buttonTextOutline}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[globalStyles.button, globalStyles.buttonOutline]}
                onPress={takePhoto}
              >
                <Ionicons name="camera" size={24} color={colors.green} />
                <Text style={globalStyles.buttonTextOutline}>Camera</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[globalStyles.button, loading && { opacity: 0.7 }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={globalStyles.buttonText}>
            {(() => {
              if (loading) {
                return 'Adding Item...';
              } else {
                return 'Add Item';
              }
            })()}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 