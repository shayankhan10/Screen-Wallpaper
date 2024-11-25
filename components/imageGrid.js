// app/components/imageGrid.js

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MasonryFlashList } from '@shopify/flash-list';
import ImageCard from '../components/imagecard';
import { getColumnCount, wp } from '../helpers/common';

const ImageGrid = ({ images, router }) => {
  const columns = getColumnCount();

  const handleImagePress = (uri) => {
    // Navigate to the image details screen when an image is clicked
    router.push({
      pathname: '/upload/image',  // Navigate to the image screen
      query: { uri },  // Pass the image URI as a query parameter
    });
  };

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={columns}
        initialNumToRender={1000}
        contentContainerStyle={styles.listContainerStyle}
        renderItem={({ item, index }) => (
          <ImageCard
            router={router}
            item={item}
            columns={columns}
            index={index}
            onPress={() => handleImagePress(item.uri)} // Pass URI to handleImagePress
          />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  listContainerStyle: {
    paddingHorizontal: wp(4),
  },
});

export default ImageGrid;
