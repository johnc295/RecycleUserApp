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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      setLoading(true);
      const itemsRef = collection(db, 'items');
      const q = query(itemsRef, orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const itemsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setItems(itemsData);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadItems();
    setRefreshing(false);
  }

  function renderItem({ item }) {
    return <ItemCard item={item} navigation={navigation} />;
  }

  function renderEmptyState() {
    return (
      <View style={globalStyles.emptyState}>
        <Ionicons name="leaf-outline" size={64} color={colors.darkGray} />
        <Text style={globalStyles.emptyStateText}>
          No items yet. Be the first to add a recyclable item!
        </Text>
        <TouchableOpacity
          style={[globalStyles.button, { marginTop: 16 }]}
          onPress={() => navigation.navigate('Add Item')}
        >
          <Text style={globalStyles.buttonText}>Add First Item</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
        <View style={[globalStyles.row, globalStyles.spaceBetween, { marginBottom: 16 }]}>
          <Text style={globalStyles.title}>Recent Items</Text>
          <TouchableOpacity
            style={globalStyles.button}
            onPress={() => navigation.navigate('Add Item')}
          >
            <Text style={globalStyles.buttonText}>Add Item</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
} 