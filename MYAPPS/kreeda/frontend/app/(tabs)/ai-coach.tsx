import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AICoach from '@/components/AICoach';

export default function AICoachScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <AICoach sport="General" userLevel="Beginner" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
});