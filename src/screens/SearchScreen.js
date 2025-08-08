import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { globalStyles, colors } from '../styles/styles';
import ItemCard from '../components/ItemCard';

export default function SearchScreen({ navigation }) {
  // State variables to store search data and UI states
  const [searchQuery, setSearchQuery] = useState('');  // Store what user types in search
  const [items, setItems] = useState([]);             // Store search results
  const [loading, setLoading] = useState(false);      // Track if search is in progress
  const [searched, setSearched] = useState(false);    // Track if user has searched yet

  // This function searches for items in the database based on user's input
  async function searchItems() {
    // If search box is empty, clear results and return
    if (!searchQuery.trim()) {
      setItems([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);   // Show loading spinner
      setSearched(true);  // Mark that user has searched

      const itemsRef = collection(db, 'items');
      
      // Create a query to search items by name
      // This uses Firebase's text search capabilities
      const q = query(
        itemsRef,
        where('name', '>=', searchQuery.trim()),           // Find names that start with search term
        where('name', '<=', searchQuery.trim() + '\uf8ff'), // Find names that end after search term
        orderBy('name')  // Sort results alphabetically
      );

      const querySnapshot = await getDocs(q);
      
      // Convert database results into a format we can use
      const searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,  // Each item gets a unique ID
        ...doc.data()  // Spread all the item data
      }));

      setItems(searchResults);  // Save search results to state
    } catch (error) {
      console.error('Error searching items:', error);
      setItems([]);  // Clear results if there's an error
    } finally {
      setLoading(false);  // Hide loading spinner
    }
  }

  // This function clears the search and resets the screen
  function clearSearch() {
    setSearchQuery('');    // Clear the search text
    setItems([]);         // Clear search results
    setSearched(false);   // Reset search state
  }

  // This function renders each search result item
  function renderItem({ item }) {
    return <ItemCard item={item} navigation={navigation} />;
  }

  // This function shows what to display when there are no search results
  function renderEmptyState() {
    return (
      <View style={globalStyles.emptyState}>
        <Ionicons name="search-outline" size={64} color={colors.darkGray} />
        <Text style={globalStyles.emptyStateText}>
          {searched ? 'No items found matching your search.' : 'Search for recyclable items'}
        </Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        {/* Search input section */}
        <View style={globalStyles.searchContainer}>
          <View style={globalStyles.row}>
            <Ionicons name="search" size={20} color={colors.darkGray} style={{ marginRight: 8 }} />
            <TextInput
              style={globalStyles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}  // Update search text as user types
              onSubmitEditing={searchItems}  // Search when user presses enter
              returnKeyType="search"  // Show "search" button on keyboard
            />
            {/* Show clear button only if there's text in search box */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search results section */}
        {loading ? (
          // Show loading spinner while searching
          <View style={globalStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.green} />
            <Text style={[globalStyles.text, { marginTop: 16 }]}>
              Searching...
            </Text>
          </View>
        ) : (
          // Show search results list
          <FlatList
            data={items}  // The search results to display
            renderItem={renderItem}  // How to render each result
            keyExtractor={(item) => item.id}  // Unique key for each item
            ListEmptyComponent={renderEmptyState}  // What to show when no results
            showsVerticalScrollIndicator={false}  // Hide scroll bar
          />
        )}
      </View>
    </View>
  );
} 