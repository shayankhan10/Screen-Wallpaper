import { View, Text, StyleSheet, TextInput, Pressable, Button } from 'react-native';
import React, { useState } from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const router = useRouter();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpload = () => {
    // Handle image upload logic
    console.log('Image:', image);
    console.log('Description:', description);
    // Perform upload here...
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Wallpaper</Text>
      <Pressable style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Text>Selected Image: {image}</Text>
        ) : (
          <Text>Pick an Image</Text>
        )}
      </Pressable>
      <TextInput
        style={styles.input}
        placeholder="Add a description..."
        value={description}
        onChangeText={setDescription}
      />
      <Button title="Upload" onPress={handleUpload} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    justifyContent: 'center',
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.semibold,
    color: theme.colors.neutral(0.9),
    marginBottom: 20,
  },
  imagePicker: {
    backgroundColor: theme.colors.grayBG,
    padding: 10,
    borderRadius: theme.radius.sm,
    marginBottom: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.sm,
    padding: 10,
    marginBottom: 20,
  },
});

export default UploadScreen;
