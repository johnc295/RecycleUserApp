import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles, colors } from '../styles/styles';

export default function ItemDetailScreen({ route, navigation }) {
  // Get the item data that was passed from the previous screen
  const { item } = route.params;

  // This function creates the colored badge that shows recyclability status
  function getBadgeStyle() {
    const status = item.recyclabilityStatus?.toLowerCase();
    let badgeStyle = globalStyles.badge;
    let badgeText = item.recyclabilityStatus || 'Unknown';

    // Choose badge color based on recyclability status
    if (status === 'recyclable') {
      badgeStyle = [globalStyles.badge, globalStyles.recyclableBadge];  // Green badge
    } else if (status === 'non-recyclable') {
      badgeStyle = [globalStyles.badge, globalStyles.nonRecyclableBadge];  // Red badge
    }

    return (
      <View style={badgeStyle}>
        <Text style={globalStyles.badgeText}>{badgeText}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.screenContainer}>
        {/* Header with back button */}
        <View style={[globalStyles.row, globalStyles.spaceBetween, { marginBottom: 16 }]}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ padding: 8 }}
          >
            <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
          </TouchableOpacity>
          <Text style={globalStyles.title}>{item.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Item image */}
        {item.imageUrl && (
          <View style={globalStyles.card}>
            <View style={globalStyles.imageContainer}>
              <Image
                source={{ uri: item.imageUrl }}
                style={globalStyles.image}
                resizeMode="cover"
              />
            </View>
          </View>
        )}

        {/* Item details */}
        <View style={globalStyles.card}>
          <View style={[globalStyles.row, globalStyles.spaceBetween, { marginBottom: 16 }]}>
            <Text style={globalStyles.subtitle}>Item Details</Text>
            {getBadgeStyle()}
          </View>

          <Text style={globalStyles.text}>
            {item.description}
          </Text>

          {/* Vote counts */}
          <View style={[globalStyles.row, { marginTop: 16, justifyContent: 'space-around' }]}>
            <View style={globalStyles.center}>
              <Ionicons name="thumbs-up" size={20} color={colors.green} />
              <Text style={globalStyles.text}>{item.upvotes || 0}</Text>
            </View>
            <View style={globalStyles.center}>
              <Ionicons name="thumbs-down" size={20} color={colors.red} />
              <Text style={globalStyles.text}>{item.downvotes || 0}</Text>
            </View>
          </View>
        </View>

        {/* User info */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Added by</Text>
          <Text style={globalStyles.text}>{item.userEmail}</Text>
          <Text style={[globalStyles.text, { fontSize: 14, color: colors.lightGray, marginTop: 4 }]}>
            {item.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
} 