import { View, Text, StyleSheet, Button } from 'react-native';
import React from 'react';
import { theme } from '../../constants/theme';
import { hp, wp } from '../../helpers/common';

const ProfileScreen = () => {
  const handleLogout = () => {
    // Perform logout logic
    console.log('Logging out...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.details}>
        <Text style={styles.detailsText}>Name: Shayan</Text>
        <Text style={styles.detailsText}>Email: shayan123@example.com</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} color={theme.colors.neutral(0.9)} />
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
  details: {
    marginBottom: 20,
  },
  detailsText: {
    fontSize: hp(2),
    color: theme.colors.neutral(0.7),
    marginBottom: 10,
  },
});

export default ProfileScreen;
