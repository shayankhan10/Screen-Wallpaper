import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { MasonryFlashList } from '@shopify/flash-list';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { wp, hp } from '../../helpers/common';
import { theme } from '../../constants/theme';

const STORAGE_KEY = 'uploaded_images';
const imagesPerPage = 25;

const UploadScreen = () => {
  const { top } = useSafeAreaInsets();

  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    saveImages();
  }, [images]);

  const saveImages = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(images));
    } catch (error) {
      console.error('Error saving images:', error);
    }
  };

  const loadImages = async () => {
    try {
      const storedImages = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedImages) {
        setImages(JSON.parse(storedImages));
      }
    } catch (error) {
      console.error('Error loading images:', error);
    }
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        id: Date.now().toString() + Math.random(),
      }));
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const loadMoreImages = () => {
    if (currentPage * imagesPerPage < images.length) {
      setIsLoading(true);
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1);
        setIsLoading(false);
      }, 1000);
    }
  };

  const deleteImage = (uri) => {
    setImages((prevImages) => prevImages.filter((image) => image.uri !== uri));
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            <Text style={styles.titleHighlight}>Wall</Text>
            tastic
          </Text>
        </Pressable>
        <Pressable style={styles.addButton} onPress={pickImages}>
          <Feather name="plus" size={15} color="white" />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1 }}>
        <Text style={styles.heading}>Uploaded Wallpapers</Text>

        <MasonryFlashList
          data={images.slice(0, currentPage * imagesPerPage)}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image style={styles.image} source={{ uri: item.uri }} />
              <Pressable style={styles.deleteButton} onPress={() => deleteImage(item.uri)}>
                <Feather name="trash-2" size={16} color="white" />
              </Pressable>
            </View>
          )}
          onEndReached={loadMoreImages}
          onEndReachedThreshold={0.5}
          estimatedItemSize={200}
          ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#000" /> : null}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 5,
    paddingHorizontal: wp(2.1), // Slightly reduced padding to fit both columns
  },
  header: {
    marginHorizontal: wp(4),
    marginTop: wp(14),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grayBG,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: theme.colors.black,
    padding: wp(2),
    borderRadius: theme.radius.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginHorizontal: wp(4),
    fontSize: hp(2.8),
    fontWeight: theme.fontWeights.bold,
    color: theme.colors.black,
    marginTop: hp(1.5),
    marginBottom: hp(1.5),
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: 'continuous',
    overflow: 'hidden',
    marginBottom: wp(2.1),
    marginHorizontal: wp(1.1)
  },
  image: {
    height: 250,
    width: '100%',
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 6,
    borderRadius: 15,
  },
});

export default UploadScreen;