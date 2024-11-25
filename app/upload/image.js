// app/upload/image.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { theme } from '../../constants/theme';
import { Entypo, Octicons } from '@expo/vector-icons';
import { hp, wp } from '../../helpers/common';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSearchParams } from 'expo-router';

const ImageScreen = () => {
  const { uri, from } = useSearchParams(); // Extract URI and 'from' parameters from query
  const router = useRouter();
  const [status, setStatus] = useState('loading');
  const [isFavorited, setIsFavorited] = useState(false);
  const fileName = uri?.split('/').pop();
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  useEffect(() => {
    if (uri) {
      checkIfFavorite();
    }
  }, [uri]);

  const checkIfFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      const parsedFavorites = JSON.parse(favorites);
      if (parsedFavorites.find(fav => fav.uri === uri)) {
        setIsFavorited(true);
      }
    }
  };

  const toggleFavorite = async () => {
    const favorites = await AsyncStorage.getItem('favorites');
    let parsedFavorites = favorites ? JSON.parse(favorites) : [];

    if (isFavorited) {
      parsedFavorites = parsedFavorites.filter(fav => fav.uri !== uri);
      showToast('Removed from favorites');
    } else {
      parsedFavorites.push({ uri });
      showToast('Added to favorites');
    }

    await AsyncStorage.setItem('favorites', JSON.stringify(parsedFavorites));
    setIsFavorited(!isFavorited);
  };

  const onLoad = () => {
    setStatus(''); // Image has loaded
  };

  const handleDownloadImage = async () => {
    if (Platform.OS === 'web') {
      const anchor = document.createElement('a');
      anchor.href = uri;
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
    setStatus('sharing');
    let uri = await downloadFile();
    if (uri) {
      await Sharing.shareAsync(uri);
    }
    setStatus('');
  };

  const downloadFile = async () => {
    try {
      const { uri } = await FileSystem.downloadAsync(uri, filePath);
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

  return (
    <BlurView style={styles.container} tint="dark" intensity={60}>
      <View style={styles.imageWrapper}>
        {status === 'loading' && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="white" />
          </View>
        )}
        <Image
          transition={100}
          style={styles.image}
          source={{ uri }} // Display the selected image
          onLoad={onLoad}
        />
      </View>
      <View style={styles.buttons}>
        <Pressable style={styles.button} onPress={() => router.back()}>
          <Octicons name="x" size={24} color="white" />
        </Pressable>
        {status === 'downloading' ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Pressable style={styles.button} onPress={handleDownloadImage}>
            <Octicons name="download" size={24} color="white" />
          </Pressable>
        )}
        {status === 'sharing' ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Pressable style={styles.button} onPress={handleShareImage}>
            <Entypo name="share" size={22} color="white" />
          </Pressable>
        )}
        {/* Conditionally render the heart button based on 'from' query */}
        {from === 'upload' && (
          <Pressable style={styles.button} onPress={toggleFavorite}>
            <Entypo name={isFavorited ? 'heart' : 'heart-outlined'} size={22} color="white" />
          </Pressable>
        )}
      </View>
      <Toast position="bottom" visibilityTime={2500} />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  imageWrapper: {
    width: wp(90),
    height: wp(80),
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: theme.radius.lg,
  },
  buttons: {
    position: 'absolute',
    top: 20,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    padding: 10,
    borderRadius: 50,
  },
  loading: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
  },
});

export default ImageScreen;
