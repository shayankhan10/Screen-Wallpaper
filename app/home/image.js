import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { BlurView } from 'expo-blur';
import { hp, wp } from '../../helpers/common';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { Entypo, Octicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ImageScreen = () => {
  const router = useRouter();
  const item = useLocalSearchParams();
  const [status, setStatus] = useState('loading');
  const [isFavorited, setIsFavorited] = useState(false); // Track favorite status
  let uri = item?.webformatURL;
  const fileName = item?.previewURL?.split('/').pop();
  const imageUrl = uri;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  // Check if the image is already favorited when the screen loads
  useEffect(() => {
    checkIfFavorite();
  }, []);

  const checkIfFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      const parsedFavorites = JSON.parse(favorites);
      if (parsedFavorites.find(fav => fav.id === item.id)) {
        setIsFavorited(true);
      }
    }
  };

  // Add or remove the image from favorites
  const toggleFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    let parsedFavorites = favorites ? JSON.parse(favorites) : [];

    if (isFavorited) {
      parsedFavorites = parsedFavorites.filter(fav => fav.id !== item.id);
      showToast('Removed from favorites');
    } else {
      parsedFavorites.push(item);
      showToast('Added to favorites');
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
    setIsFavorited(!isFavorited);
  };

  const getSize = () => {
    const aspectRatio = item?.imageWidth / item?.imageHeight;

    const maxWidth = Platform.OS === 'web' ? wp(50) : wp(92);
    let calculatedHeight = maxWidth / aspectRatio;
    let calculatedWidth = maxWidth;

    if (aspectRatio < 1) {
      calculatedWidth = calculatedHeight * aspectRatio;
    }
    return {
      width: calculatedWidth,
      height: calculatedHeight,
    };
  };

  const onLoad = () => {
    setStatus('');
  };

  const handleDownloadImage = async () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a');
      anchor.href = imageUrl;
      anchor.target = '_blank';
      anchor.download = fileName || 'download';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    } else {
      setStatus('downloading');
      let uri = await downloadFile();
      if (uri) {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync('Downloads', asset, false);
          showToast('Image Downloaded');
        } else {
          Alert.alert('Permission Denied', 'You need to grant permission to save the image.');
        }
      }
      setStatus('');
    }
  };

  const handleShareImage = async () => {
    if (Platform.OS === 'web') {
      showToast('Link copied to clipboard!');
    } else {
      setStatus('sharing');
      let uri = await downloadFile();
      if (uri) {
        await Sharing.shareAsync(uri);
      }
      setStatus('');
    }
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(imageUrl, filePath);
      console.log('Downloaded at:', uri);
      return uri;
    } catch (err) {
      console.log('Download error:', err.message);
      Alert.alert('Error', err.message);
      setStatus('');
      return null;
    }
  };

  const showToast = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
    });
  };

  const toastConfig = {
    success: ({ text1 }) => {
      return (
        <View style={[styles.toast, { marginBottom: hp(6) }]}>
          <Text style={styles.toastText}>{text1}</Text>
        </View>
      );
    },
  };

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={getSize()}>
        {status === 'loading' && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        <Image
          transition={100}
          style={[styles.image, getSize()]}
          source={uri}
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Animated.View entering={FadeInDown.springify()}>
          <Pressable style={styles.button} onPress={() => router.back()}>
            <Octicons name="x" size={24} color="white" />
          </Pressable>
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(100)}>
          {status === 'downloading' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleDownloadImage}>
              <Octicons name="download" size={24} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(200)}>
          {status === 'sharing' ? (
            <View style={styles.button}>
              <ActivityIndicator size="small" color="white" />
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleShareImage}>
              <Entypo name="share" size={22} color="white" />
            </Pressable>
          )}
        </Animated.View>
        <Animated.View entering={FadeInDown.springify().delay(300)}>
          <Pressable style={styles.button} onPress={toggleFavorite}>
            <Entypo name={isFavorited ? "heart" : "heart-outlined"} size={22} color="white" />
          </Pressable>
        </Animated.View>
      </View>
      <Toast config={toastConfig} position="bottom" visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  image: {
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loading: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttons: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 50,
  },
  button: {
    height: hp(6),
    width: hp(6),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: theme.radius.lg,
  },
  toast: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: theme.radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  toastText: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.white,
  },
});

export default ImageScreen;
