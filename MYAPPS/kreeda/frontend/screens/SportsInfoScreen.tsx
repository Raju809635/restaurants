import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const SportsInfoScreen = () => {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Sports Information</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default SportsInfoScreen; 