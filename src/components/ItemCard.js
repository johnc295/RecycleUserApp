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
  // State variables to track voting data and UI states
  const [upvotes, setUpvotes] = useState(item.upvotes || 0);      // Number of upvotes
  const [downvotes, setDownvotes] = useState(item.downvotes || 0); // Number of downvotes
  const [userVote, setUserVote] = useState(null);                 // User's current vote (upvote/downvote/null)
  const { user } = useAuth();  // Get current user info

  // This runs when the component first loads
  // It checks if the current user has already voted on this item
  useEffect(() => {
    loadUserVote();
  }, []);

  // This function checks if the current user has already voted on this item
  async function loadUserVote() {
    if (!user) return;  // If no user is logged in, don't check

    try {
      // Create a unique ID for this user's vote on this item
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      const voteDoc = await getDoc(voteRef);
      
      // If the user has voted before, remember their vote
      if (voteDoc.exists()) {
        setUserVote(voteDoc.data().vote);
      }
    } catch (error) {
      console.error('Error loading vote:', error);
    }
  }

  // This function handles when user taps upvote or downvote
  async function handleVote(voteType) {
    if (!user) {
      Alert.alert('Error', 'Please login to vote');
      return;
    }

    try {
      const voteRef = doc(db, 'votes', `${user.uid}_${item.id}`);
      
      // If user already voted the same way, remove their vote (toggle off)
      if (userVote === voteType) {
        if (voteType === 'upvote') {
          setUpvotes(upvotes - 1);  // Remove one upvote
        } else {
          setDownvotes(downvotes - 1);  // Remove one downvote
        }
        setUserVote(null);  // Clear user's vote
        await setDoc(voteRef, { vote: null });  // Save to database
        return;
      }

      // Update vote counts based on what user clicked
      if (voteType === 'upvote') {
        setUpvotes(upvotes + 1);  // Add one upvote
        if (userVote === 'downvote') {
          setDownvotes(downvotes - 1);  // Remove previous downvote
        }
      } else {
        setDownvotes(downvotes + 1);  // Add one downvote
        if (userVote === 'upvote') {
          setUpvotes(upvotes - 1);  // Remove previous upvote
        }
      }

      setUserVote(voteType);  // Remember user's new vote

      // Save the vote to the database
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

  // This function determines the color of vote icons
  function getIconColor(voteType) {
    if (userVote === voteType) {
      return colors.white;  // White icon if user voted this way
    } else {
      return colors.darkGray;  // Gray icon if user didn't vote this way
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
        <View style={globalStyles.imageContainer}>
          <Image
            source={{ uri: item.imageUrl }}
            style={globalStyles.image}
            resizeMode="cover"
          />
        </View>
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