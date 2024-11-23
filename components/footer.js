import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Footer = () => {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <Pressable onPress={() => router.push('/home')} style={styles.footerItem}>
        <Ionicons name="home" size={24} color="black" />
        <Text>Home</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/favorites')} style={styles.footerItem}>
        <Ionicons name="heart" size={24} color="black" />
        <Text>Favorites</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/upload')} style={styles.footerItem}>
        <Ionicons name="cloud-upload" size={24} color="black" />
        <Text>Upload</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/profile')} style={styles.footerItem}>
        <Ionicons name="person" size={24} color="black" />
        <Text>Profile</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  footerItem: {
    alignItems: 'center',
  },
});

export default Footer;
