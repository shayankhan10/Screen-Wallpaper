import { View, Text, StyleSheet, Pressable, Button, Image, ActivityIndicator, ScrollView } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageGrid from '../../components/imageGrid';

let page = 1; // Page counter
const ITEMS_PER_PAGE = 25;

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [allUploadedImages, setAllUploadedImages] = useState([]); // To store all images from AsyncStorage
  const [uploadedImages, setUploadedImages] = useState([]); // To store paginated images
  const [loading, setLoading] = useState(true);
  const [isEndReached, setIsEndReached] = useState(false);
  const scrollRef = useRef(null);
  const router = useRouter();

  // Fetch uploaded images from AsyncStorage on component mount
  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem('uploadedImages');
        const images = storedImages ? JSON.parse(storedImages) : [];
        setAllUploadedImages(images);
        setUploadedImages(images.slice(0, ITEMS_PER_PAGE)); // Load initial 25 images
      } catch (error) {
        console.log('Error loading images from AsyncStorage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (image) {
      const isDuplicate = allUploadedImages.some((img) => img.uri === image);
      if (isDuplicate) {
        alert('This image is already uploaded.');
        return;
      }

      const newUploadedImages = [...allUploadedImages, { uri: image }];
      setAllUploadedImages(newUploadedImages);
      setUploadedImages(newUploadedImages.slice(0, page * ITEMS_PER_PAGE)); // Update visible images
      setImage(null);

      try {
        await AsyncStorage.setItem(
          'uploadedImages',
          JSON.stringify(newUploadedImages)
        );
      } catch (error) {
        console.log('Error saving images to AsyncStorage:', error);
      }
    } else {
      alert('Please select an image before uploading.');
    }
  };

  const loadMoreImages = () => {
    const startIndex = page * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    if (startIndex < allUploadedImages.length) {
      const newImages = allUploadedImages.slice(startIndex, endIndex);
      setUploadedImages((prevImages) => [...prevImages, ...newImages]);
      page++;
    }
  };

  const handleScroll = (event) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isEndReached) {
        setIsEndReached(true);
        loadMoreImages();
      }
    } else if (isEndReached) {
      setIsEndReached(false);
    }
  };

  const handleScrollUp = () => {
    scrollRef?.current?.scrollTo({
      y: 0,
      animated: true,
    });
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.header}>
        <Pressable onPress={handleScrollUp}>
          <Text style={styles.title}>
            <Text style={styles.titleHighlight}>Wall</Text>
            tastic
          </Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        ref={scrollRef}
        onScroll={handleScroll}
        scrollEventThrottle={5}
      >
        {/* Upload Form */}
        <View style={styles.form}>
          <Text style={styles.uploadTitle}>Upload Wallpaper</Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {image ? (
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.imageText}>Pick an Image</Text>
            )}
          </Pressable>
          <Button title="Upload" onPress={handleUpload} />
        </View>

        {/* Display Uploaded Images in Grid Layout */}
        <View style={styles.uploadedImages}>
          {uploadedImages.length > 0 && (
            <Text style={styles.uploadedTitle}>Uploaded Wallpapers:</Text>
          )}

          {/* Pass the uploaded images to ImageGrid */}
          <View style={styles.imageGridContainer}>
            {uploadedImages.length > 0 && (
              <ImageGrid images={uploadedImages} router={router} />
            )}
          </View>
        </View>

        {isEndReached && (
          <ActivityIndicator size="large" color={theme.colors.primary} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
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
  },
  titleHighlight: {
    color: theme.colors.primary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: wp(4),
    paddingBottom: wp(4),
  },
  form: {
    alignItems: 'center',
    marginTop: wp(2),
  },
  uploadTitle: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    marginBottom: wp(4),
    alignSelf: 'flex-start',
  },
  imagePicker: {
    backgroundColor: theme.colors.grayBG,
    padding: wp(3),
    borderRadius: theme.radius.sm,
    width: '80%',
    alignItems: 'flex-start',
    marginBottom: wp(4),
  },
  imageText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
  },
  previewImage: {
    width: '100%',
    height: wp(30),
    borderRadius: theme.radius.sm,
  },
  uploadedImages: {
    marginTop: wp(6),
    alignItems: 'center',
  },
  uploadedTitle: {
    fontSize: hp(2.5),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    marginBottom: wp(3),
  },
  imageGridContainer: {
    width: '100%',
    marginTop: wp(4),
    marginRight: wp(8),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UploadScreen;
