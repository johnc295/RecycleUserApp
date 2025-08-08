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
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Search for items in Firebase database
  async function searchItems() {
    if (!searchQuery.trim()) {
      setItems([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const itemsRef = collection(db, 'items');
      
      // Create query to search items by name
      const q = query(
        itemsRef,
        where('name', '>=', searchQuery.trim()),
        where('name', '<=', searchQuery.trim() + '\uf8ff'),
        orderBy('name')
      );

      const querySnapshot = await getDocs(q);
      
      const searchResults = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(searchResults);
    } catch (error) {
      console.error('Error searching items:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Clear search and reset screen state
  function clearSearch() {
    setSearchQuery('');
    setItems([]);
    setSearched(false);
  }

  function renderItem({ item }) {
    return <ItemCard item={item} navigation={navigation} />;
  }

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
        {/* Search input */}
        <View style={globalStyles.searchContainer}>
          <View style={globalStyles.row}>
            <Ionicons name="search" size={20} color={colors.darkGray} style={{ marginRight: 8 }} />
            <TextInput
              style={globalStyles.searchInput}
              placeholder="Search items..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={searchItems}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={colors.darkGray} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Search results */}
        {loading ? (
          <View style={globalStyles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.green} />
            <Text style={[globalStyles.text, { marginTop: 16 }]}>
              Searching...
            </Text>
          </View>
        ) : (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={renderEmptyState}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
} 