// Import React and the useState hook for managing component state
import React, { useState } from 'react';
// Import necessary React Native components for building the UI
import {
  View,           // Container component for layout
  Text,           // For displaying text
  TextInput,      // Input field for search queries
  FlatList,       // Efficient list component for displaying search results
  TouchableOpacity, // Button component that responds to touch
  ActivityIndicator, // Loading spinner component
} from 'react-native';
// Import icons from Expo's vector icons library
import { Ionicons } from '@expo/vector-icons';
// Import Firebase Firestore functions for database operations
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
// Import our Firebase database configuration
import { db } from '../config/firebase';
// Import global styles and color scheme for consistent theming
import { globalStyles, colors } from '../styles/styles';
// Import the ItemCard component to display individual items in search results
import ItemCard from '../components/ItemCard';

// Main SearchScreen component - handles searching for recyclable items
// navigation prop is passed from React Navigation for screen navigation
export default function SearchScreen({ navigation }) {
  // State management using React hooks
  // searchQuery: stores the current text in the search input field
  const [searchQuery, setSearchQuery] = useState('');
  // items: stores the array of items returned from the search
  const [items, setItems] = useState([]);
  // loading: boolean flag to show/hide loading spinner during search
  const [loading, setLoading] = useState(false);
  // searched: boolean flag to track if a search has been performed
  // This helps distinguish between "no search yet" vs "no results found"
  const [searched, setSearched] = useState(false);

  // Async function to search for items in the Firebase database
  // This function is called when user submits search or presses search button
  async function searchItems() {
    // Early return if search query is empty or only whitespace
    // This prevents unnecessary database calls
    if (!searchQuery.trim()) {
      setItems([]);        // Clear any existing results
      setSearched(false);  // Reset search state
      return;
    }

    try {
      // Show loading spinner and indicate search is in progress
      setLoading(true);
      setSearched(true);

      // Create a reference to the 'items' collection in Firestore
      const itemsRef = collection(db, 'items');
      
      // Build a complex query to search for items by name
      // This uses Firebase's range queries for efficient text search
      const q = query(
        itemsRef,
        // Search for items where name is greater than or equal to search query
        where('name', '>=', searchQuery.trim()),
        // And less than or equal to search query + a high Unicode character
        // This creates a range that matches items starting with the search term
        where('name', '<=', searchQuery.trim() + '\uf8ff'),
        // Sort results alphabetically by name
        orderBy('name')
      );

      // Execute the query and get the results
      const querySnapshot = await getDocs(q);
      
      // Transform the Firestore documents into a format our app can use
      // Each document becomes an object with id and all the item data
      const searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,        // Firestore document ID
        ...doc.data()      // Spread all the item data (name, description, etc.)
      }));

      // Update the items state with search results
      setItems(searchResults);
    } catch (error) {
      // Handle any errors that occur during the search
      console.error('Error searching items:', error);
      setItems([]); // Clear results on error
    } finally {
      // Always hide the loading spinner, whether search succeeded or failed
      setLoading(false);
    }
  }

  // Function to clear the search and reset the screen to initial state
  // Called when user presses the X button next to search input
  function clearSearch() {
    setSearchQuery('');    // Clear the search input
    setItems([]);         // Clear search results
    setSearched(false);   // Reset search state
  }

  // Function to render each individual item in the search results list
  // This is passed to FlatList as the renderItem prop
  function renderItem({ item }) {
    // Use our custom ItemCard component to display each item
    // Pass the item data and navigation object to ItemCard
    return <ItemCard item={item} navigation={navigation} />;
  }

  // Function to render the empty state when no items are found
  // This shows different content based on whether a search has been performed
  function renderEmptyState() {
    // If no search has been performed yet, show initial search prompt
    if (!searched) {
      return (
        <View style={globalStyles.emptyState}>
          {/* Search icon to visually indicate this is a search screen */}
          <Ionicons name="search" size={64} color={colors.darkGray} />
          <Text style={globalStyles.emptyStateText}>
            Search for recyclable items by name
          </Text>
        </View>
      );
    }

    // If a search was performed but no results found, show "no results" message
    return (
      <View style={globalStyles.emptyState}>
        {/* Different icon to indicate search was performed but found nothing */}
        <Ionicons name="search-outline" size={64} color={colors.darkGray} />
        <Text style={globalStyles.emptyStateText}>
          No items found for "{searchQuery}"
        </Text>
      </View>
    );
  }

  // Main render function - returns the JSX for the entire search screen
  return (
    // Outer container with global styling
    <View style={globalStyles.container}>
      {/* Inner container for the screen content */}
      <View style={globalStyles.screenContainer}>
        {/* Screen title */}
        <Text style={globalStyles.title}>Search Items</Text>

        {/* Search input section */}
        <View style={globalStyles.searchContainer}>
          {/* Row layout for search input and buttons */}
          <View style={[globalStyles.row, { alignItems: 'center' }]}>
            {/* Search icon inside the input field */}
            <Ionicons name="search" size={20} color={colors.darkGray} style={{ marginLeft: 12 }} />
            
            {/* Text input for search queries */}
            <TextInput
              style={[globalStyles.searchInput, { flex: 1 }]}
              placeholder="Search by item name..."  // Placeholder text
              value={searchQuery}                   // Controlled input value
              onChangeText={setSearchQuery}         // Update state when text changes
              onSubmitEditing={searchItems}         // Trigger search when user presses enter
              returnKeyType="search"                // Show "search" button on keyboard
              autoCapitalize="none"                 // Don't auto-capitalize
              autoCorrect={false}                   // Don't auto-correct
            />
            
            {/* Clear button (X) - only shows when there's text in the input */}
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={{ padding: 12 }}>
                <Ionicons name="close-circle" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            )}
            
            {/* Search button */}
            <TouchableOpacity
              onPress={searchItems}
              style={[globalStyles.button, { marginLeft: 8, paddingHorizontal: 16 }]}
            >
              <Text style={globalStyles.buttonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional rendering based on loading state */}
        {loading ? (
          // Show loading spinner and text while searching
          <View style={globalStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.green} />
            <Text style={[globalStyles.text, { marginTop: 16 }]}>
              Searching...
            </Text>
          </View>
        ) : (
          // Show search results list when not loading
          <FlatList
            data={items}                           // Array of items to display
            renderItem={renderItem}                // Function to render each item
            keyExtractor={(item) => item.id}      // Unique key for each item
            ListEmptyComponent={renderEmptyState}  // Component to show when list is empty
            showsVerticalScrollIndicator={false}   // Hide scroll indicator for cleaner look
          />
        )}
      </View>
    </View>
  );
} 