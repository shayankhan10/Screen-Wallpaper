import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { useRouter } from 'expo-router';
import ImageGrid from '../../components/imageGrid';

const FavoritesScreen = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Fetch favorites from storage or API
    const fetchFavorites = async () => {
      // Replace with actual fetching logic
      const fetchedFavorites = []; // Example
      setFavorites(fetchedFavorites);
    };
    fetchFavorites();
  }, []);

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Persistent Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            <Text style={styles.titleHighlight}>Wall</Text>
            tastic
          </Text>
        </Pressable>
      </View>

      {/* Favorites Content */}
      {favorites.length > 0 ? (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
        >
          <ImageGrid images={favorites} router={router} />
        </ScrollView>
      ) : (
        <View style={styles.noFavoritesContainer}>
          <Text style={styles.noFavorites}>No favorites added yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15
  },
  header: {
    marginHorizontal: wp(4),
    marginTop: wp(14),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grayBG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    textAlign: 'center',
  },
  scrollView: {
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
    gap: 15,
  },
  noFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavorites: {
    fontSize: hp(2),
    textAlign: 'center',
    color: theme.colors.neutral(0.6),
  },
});

export default FavoritesScreen;
