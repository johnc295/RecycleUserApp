import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/styles';
import ItemCard from '../components/ItemCard';

export default function HomeScreen({ navigation }) {
  // State variables to store data and UI states
  const [items, setItems] = useState([]);           // Store the list of items
  const [loading, setLoading] = useState(true);     // Track if we're loading items
  const [refreshing, setRefreshing] = useState(false); // Track pull-to-refresh state
  const { user } = useAuth();  // Get current user info

  // This runs when the component first loads
  useEffect(() => {
    loadItems();
  }, []);

  // This function gets the most recent items from the database
  async function loadItems() {
    try {
      setLoading(true);  // Show loading spinner
      
      // Create a query to get the 10 most recent items
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      // Convert the database data into a format we can use
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,  // Each item gets a unique ID
        ...doc.data()  // Spread all the item data (name, description, etc.)
      }));
      
      setItems(itemsData);  // Save the items to our state
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);  // Hide loading spinner
    }
  }

  // This function handles pull-to-refresh (when user pulls down on the list)
  async function onRefresh() {
    setRefreshing(true);  // Show refresh indicator
    await loadItems();    // Reload the items
    setRefreshing(false); // Hide refresh indicator
  }

  // This function renders each individual item in the list
  function renderItem({ item }) {
    return <ItemCard item={item} navigation={navigation} />;
  }

  // This function shows what to display when there are no items
  function renderEmptyState() {
    return (
      <View style={globalStyles.emptyState}>
        <Ionicons name="leaf-outline" size={64} color={colors.darkGray} />
        <Text style={globalStyles.emptyStateText}>
          No items yet. Be the first to add a recyclable item!
        </Text>
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 16 }]}
          onPress={() => navigation.navigate('Add Item')}  // Go to add item screen
        >
          <Text style={globalStyles.buttonText}>Add First Item</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Show loading screen while fetching data
  if (loading) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={[globalStyles.text, { marginTop: 16 }]}>
          Loading items...
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        {/* Header section with title and add button */}
        <View style={[globalStyles.row, globalStyles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={globalStyles.title}>Recent Items</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('Add Item')}  // Go to add item screen
          >
            <Text style={globalStyles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        {/* List of items */}
        <FlatList
          data={items}  // The list of items to display
          renderItem={renderItem}  // How to render each item
          keyExtractor={(item) => item.id}  // Unique key for each item
          ListEmptyComponent={renderEmptyState}  // What to show when list is empty
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}  // Hide scroll bar
        />
      </View>
    </View>
  );
} 