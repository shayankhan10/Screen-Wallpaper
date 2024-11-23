import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import ImageGrid from '../../components/imageGrid';

const FavoritesScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    // Fetch favorites from storage or API
    const fetchFavorites = async () => {
      // Replace with actual fetching logic
      const fetchedFavorites = []; // Example
      setFavorites(fetchedFavorites);
    };
    fetchFavorites();
  }, []);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Feather name="heart" size={24} color={theme.colors.neutral(0.9)} />
        <Text style={styles.title}>Favorites</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {favorites.length > 0 ? (
          <ImageGrid images={favorites} router={router} />
        ) : (
          <Text style={styles.noFavorites}>No favorites added yet.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  scrollView: {
    gap: 15,
  },
  noFavorites: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.neutral(0.6),
  },
});

export default FavoritesScreen;
