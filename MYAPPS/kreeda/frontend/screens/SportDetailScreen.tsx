import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { Sport } from '../types';

interface SportDetailScreenProps {
  route: {
    params: {
      sport: Sport;
    };
  };
}

const SportDetailScreen: React.FC<SportDetailScreenProps> = ({ route }) => {
  const { sport } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Cover source={{ uri: sport.imageUrl }} />
        <Card.Content>
          <Text variant="headlineMedium" style={styles.title}>{sport.name}</Text>
          <Text variant="bodyLarge" style={styles.description}>{sport.description}</Text>
          
          <View style={styles.section}>
            <Text variant="titleMedium">Category</Text>
            <Text variant="bodyMedium">{sport.category}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium">Level</Text>
            <Text variant="bodyMedium">{sport.level}</Text>
          </View>

          <View style={styles.section}>
            <Text variant="titleMedium">Experience</Text>
            <Text variant="bodyMedium">{sport.experience} years</Text>
          </View>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained">Join Event</Button>
          <Button mode="outlined">View Schedule</Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    margin: 16,
  },
  title: {
    marginTop: 16,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  section: {
    marginVertical: 8,
  },
});

export default SportDetailScreen; 