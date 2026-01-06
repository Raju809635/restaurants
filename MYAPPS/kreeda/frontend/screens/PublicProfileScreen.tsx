import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { Profile } from '../types';
import ProfileHeader from '../components/ProfileHeader';

interface PublicProfileScreenProps {
  route: {
    params: {
      profile: Profile;
    };
  };
}

const PublicProfileScreen: React.FC<PublicProfileScreenProps> = ({ route }) => {
  const { profile } = route.params;

  return (
    <ScrollView style={styles.container}>
      <ProfileHeader
        name={profile.name}
        avatar={profile.avatar}
        title={profile.bio}
      />

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text variant="headlineMedium">{profile.stats.totalEvents}</Text>
          <Text variant="bodyMedium">Events</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineMedium">{profile.stats.totalAchievements}</Text>
          <Text variant="bodyMedium">Achievements</Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="headlineMedium">{profile.stats.totalSports}</Text>
          <Text variant="bodyMedium">Sports</Text>
        </View>
      </View>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Sports</Text>
          {profile.sports.map((sport) => (
            <View key={sport.id} style={styles.sportItem}>
              <Text variant="bodyLarge">{sport.name}</Text>
              <Text variant="bodyMedium">Level: {sport.level}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Card style={styles.section}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>Achievements</Text>
          {profile.achievements.map((achievement) => (
            <View key={achievement.id} style={styles.achievementItem}>
              <Text variant="bodyLarge">{achievement.title}</Text>
              <Text variant="bodyMedium">{achievement.description}</Text>
              <Text variant="bodySmall">{achievement.date}</Text>
            </View>
          ))}
        </Card.Content>
      </Card>

      <Button mode="contained" style={styles.messageButton}>
        Send Message
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  section: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  sportItem: {
    marginBottom: 12,
  },
  achievementItem: {
    marginBottom: 16,
  },
  messageButton: {
    margin: 16,
  },
});

export default PublicProfileScreen; 