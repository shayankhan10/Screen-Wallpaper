import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Modal, Image, Alert, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import * as ImagePicker from 'expo-image-picker';

const UploadScreen = () => {
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  // State to handle modal visibility, selected image, and images array
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]); // State to store all uploaded images

  // Request permission to access the camera roll
  const requestGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'We need permission to access your gallery to choose an image.',
        [{ text: 'OK' }]
      );
    } else {
      pickImageFromGallery();
    }
  };

  // Pick an image from the gallery
  const pickImageFromGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Ask for confirmation before adding the image
      Alert.alert(
        'Do you want to add this image to your uploaded wallpapers?',
        '',
        [
          {
            text: 'Cancel',
            onPress: () => setIsModalVisible(false),
            style: 'cancel',
          },
          {
            text: 'Add',
            onPress: () => {
              setUploadedImages((prevImages) => [...prevImages, result.uri]); // Add image to the uploadedImages array
              setIsModalVisible(false); // Close modal after adding image
            },
          },
        ]
      );
    } else {
      setIsModalVisible(false); // Close modal if no image was selected
    }
  };

  // Open the camera to capture an image
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setUploadedImages((prevImages) => [...prevImages, result.uri]); // Add image to the uploadedImages array
    }
    setIsModalVisible(false); // Close modal after taking the picture
  };

  // Close the modal when tapping outside
  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable>
          <Text style={styles.title}>Walltastic</Text>
        </Pressable>
        <Pressable onPress={() => setIsModalVisible(true)}>
          <MaterialIcons name="add-photo-alternate" size={32} color={theme.colors.black} />
        </Pressable>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={{ gap: 15 }}>
        <Text style={styles.heading}>Uploaded Wallpapers</Text>

        {/* Display uploaded images */}
        <View style={styles.imageGrid}>
          {uploadedImages.length > 0 ? (
            uploadedImages.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
              </View>
            ))
          ) : (
            <View style={styles.centeredMessage}>
              <Text style={styles.noImageText}>No images uploaded yet.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal to choose option */}
      <Modal visible={isModalVisible} transparent={true} animationType="fade" onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              {/* Modal options */}
              <Pressable style={styles.button} onPress={requestGalleryPermission}>
                <Text style={styles.buttonText}>Choose from Gallery</Text>
              </Pressable>
              <Pressable style={[styles.button, styles.secondButton]} onPress={openCamera}>
                <Text style={styles.buttonText}>Open Camera</Text>
              </Pressable>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
  },
  heading: {
    marginHorizontal: wp(4),
    fontWeight: theme.fontWeights.semibold,
    fontSize: hp(2.5),
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(4),
  },
  imageContainer: {
    width: wp(45), // Adjust image size here
    marginBottom: wp(4),
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  centeredMessage: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Take up all the remaining space
    height: 500, // Optional: Adjust if you want to constrain the message height
  },
  noImageText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 25,
    borderRadius: 15,
    width: 250,
    alignItems: 'center',
  },
  button: {
    backgroundColor: theme.colors.black,
    width: '100%',
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    marginBottom: 12, // Space between buttons
    alignItems: 'center',
  },
  secondButton: {
    marginBottom: 1.8
  },
  buttonText: {
    color: 'white',
    fontSize: hp(2.2),
    fontWeight: theme.fontWeights.semibold,
  },
});

export default UploadScreen;
