import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { globalStyles, colors } from '../styles/styles';

export default function ItemCard({ item, navigation }) {
  const [upvotes, setUpvotes] = useState(item.upvotes || 0);
  const [downvotes, setDownvotes] = useState(item.downvotes || 0);
  const [userVote, setUserVote] = useState(null);
  const { user } = useAuth();

  // Load user's previous vote when component loads
  useEffect(() => {
    loadUserVote();
  }, []);

  // Get user's previous vote from database
  async function loadUserVote() {
    if (!user) return;

    try {
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      const voteDoc = await getDoc(voteRef);
      
      if (voteDoc.exists()) {
        setUserVote(voteDoc.data().vote);
      }
    } catch (error) {
      console.error('Error loading vote:', error);
    }
  }

  // Handle voting
  async function handleVote(voteType) {
    if (!user) {
      Alert.alert('Error', 'Please login to vote');
      return;
    }

    try {
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      
      // If user already voted the same way, remove the vote
      if (userVote === voteType) {
        if (voteType === 'upvote') {
          setUpvotes(upvotes - 1);
        } else {
          setDownvotes(downvotes - 1);
        }
        setUserVote(null);
        await setDoc(voteRef, { vote: null });
        return;
      }

      // Update vote counts
      if (voteType === 'upvote') {
        setUpvotes(upvotes + 1);
        if (userVote === 'downvote') {
          setDownvotes(downvotes - 1);
        }
      } else {
        setDownvotes(downvotes + 1);
        if (userVote === 'upvote') {
          setUpvotes(upvotes - 1);
        }
      }

      setUserVote(voteType);

      // Save vote to database
      await setDoc(voteRef, {
        vote: voteType,
        userId: user.uid,
        itemId: item.id,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error voting:', error);
      Alert.alert('Error', 'Failed to vote. Please try again.');
    }
  }

  // Get badge style based on recyclability status
  function getBadgeStyle() {
    const status = item.recyclabilityStatus?.toLowerCase();
    let badgeStyle = globalStyles.badge;
    let badgeText = item.recyclabilityStatus || 'Unknown';

    if (status === 'recyclable') {
      badgeStyle = [globalStyles.badge, globalStyles.recyclableBadge];
    } else if (status === 'non-recyclable') {
      badgeStyle = [globalStyles.badge, globalStyles.nonRecyclableBadge];
    }

    return (
      <View style={badgeStyle}>
        <Text style={globalStyles.badgeText}>{badgeText}</Text>
      </View>
    );
  }

  // Get icon color based on vote state
  function getIconColor(voteType) {
    if (userVote === voteType) {
      return colors.white;
    } else {
      return colors.darkGray;
    }
  }

  return (
    <TouchableOpacity
      style={globalStyles.card}
      onPress={() => navigation.navigate('ItemDetail', { item })}
    >
      {/* Item header with name and badge */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <Text style={globalStyles.subtitle}>{item.name}</Text>
        {getBadgeStyle()}
      </View>

      {/* Item image */}
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={globalStyles.image}
          resizeMode="cover"
        />
      )}

      {/* Item description */}
      <Text style={globalStyles.text} numberOfLines={3}>
        {item.description}
      </Text>

      {/* Vote buttons */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[
              globalStyles.voteButton,
              userVote === 'upvote' && globalStyles.voteButtonActive
            ]}
            onPress={() => handleVote('upvote')}
          >
            <Ionicons 
              name="thumbs-up" 
              size={16} 
              color={getIconColor('upvote')} 
            />
            <Text style={[
              globalStyles.voteButtonText,
              userVote === 'upvote' && globalStyles.voteButtonTextActive
            ]}>
              {upvotes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              globalStyles.voteButton,
              userVote === 'downvote' && globalStyles.voteButtonActive
            ]}
            onPress={() => handleVote('downvote')}
          >
            <Ionicons 
              name="thumbs-down" 
              size={16} 
              color={getIconColor('downvote')} 
            />
            <Text style={[
              globalStyles.voteButtonText,
              userVote === 'downvote' && globalStyles.voteButtonTextActive
            ]}>
              {downvotes}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
} 