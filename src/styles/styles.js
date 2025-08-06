import { StyleSheet } from 'react-native';

// Color palette
export const colors = {
  green: '#4CAF50',
  orange: '#FF9800',
  white: '#FFFFFF',
  gray: '#F5F5F5',
  darkGray: '#212121',
  red: '#F44336',
  lightGray: '#E0E0E0',
  // Additional color aliases
  primary: '#4CAF50',
  text: '#212121',
  surface: '#FFFFFF',
  error: '#F44336',
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Main containers
  container: {
    flex: 1,
    backgroundColor: colors.gray,
  },
  screenContainer: {
    flex: 1,
    padding: 16,
  },
  
  // Cards and boxes
  card: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  
  // Input fields
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    padding: 12,
    marginVertical: 8,
    fontSize: 16,
  },
  
  // Buttons
  button: {
    backgroundColor: colors.green,
    padding: 16,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.green,
  },
  buttonSecondary: {
    backgroundColor: colors.orange,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextOutline: {
    color: colors.green,
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  // Text styles
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.darkGray,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: colors.darkGray,
  },
  
  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  
  // Images
  image: {
    width: '100%',
    height: 200,
    marginVertical: 8,
  },
  
  // Avatar
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Badges
  badge: {
    backgroundColor: colors.green,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 4,
  },
  badgeText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  recyclableBadge: {
    backgroundColor: colors.green,
  },
  nonRecyclableBadge: {
    backgroundColor: colors.red,
  },
  
  // Vote buttons
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  voteButtonActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
  },
  voteButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 'bold',
  },
  voteButtonTextActive: {
    color: colors.white,
  },
  
  // Search
  searchContainer: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    marginBottom: 16,
  },
  searchInput: {
    padding: 12,
    fontSize: 16,
  },
  
  // Empty states
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.darkGray,
    textAlign: 'center',
    marginTop: 16,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 