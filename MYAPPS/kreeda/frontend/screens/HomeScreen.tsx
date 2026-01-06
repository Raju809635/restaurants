import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  IconButton,
  Chip,
  Surface,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { sampleEvents, sampleSports } from '../data/sampleData';
import EventCard from '../components/EventCard';

const { width } = Dimensions.get('window');

interface QuickStat {
  label: string;
  value: string;
  icon: string;
  color: string;
}

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const quickStats: QuickStat[] = [
    { label: 'Events Joined', value: '12', icon: 'calendar', color: '#FF6B35' },
    { label: 'Achievements', value: '8', icon: 'trophy', color: '#10B981' },
    { label: 'Sports Played', value: '5', icon: 'run', color: '#F59E0B' },
    { label: 'Friends', value: '24', icon: 'account-group', color: '#3B82F6' },
  ];

  const categories = ['All', 'Cricket', 'Football', 'Kabaddi', 'Running', 'Basketball'];

  const featuredEvents = sampleEvents.slice(0, 3);
  const trendingSports = sampleSports.slice(0, 4);

  const renderQuickStat = ({ item }: { item: QuickStat }) => (
    <Surface style={styles.statCard} elevation={2}>
      <View style={styles.statContent}>
        <IconButton
          icon={item.icon}
          size={24}
          iconColor={item.color}
          style={[styles.statIcon, { backgroundColor: `${item.color}15` }]}
        />
        <Text variant="titleLarge" style={styles.statValue}>{item.value}</Text>
        <Text variant="bodySmall" style={styles.statLabel}>{item.label}</Text>
      </View>
    </Surface>
  );

  const renderSportCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.sportCard}
      onPress={() => navigation.navigate('SportsInfo', { sport: item })}
    >
      <LinearGradient
        colors={['#FF6B35', '#F59E0B']}
        style={styles.sportGradient}
      >
        <Text style={styles.sportName}>{item.name}</Text>
        <Text style={styles.sportCategory}>{item.category}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text variant="headlineSmall" style={styles.greeting}>
            नमस्ते! Welcome to
          </Text>
          <Text variant="displaySmall" style={styles.appName}>
            Krida 🏏
          </Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Avatar.Image
            size={48}
            source={require('../assets/default-avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Quick Stats
        </Text>
        <FlatList
          data={quickStats}
          renderItem={renderQuickStat}
          keyExtractor={(item) => item.label}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        />
      </View>

      {/* Featured Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Featured Events
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Competitions')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        {featuredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={{
              ...event,
              rating: 4.5,
              difficulty: 'Intermediate',
              category: 'Public',
              city: 'Mumbai',
              state: 'Maharashtra'
            }}
            onPress={() => navigation.navigate('EventDetails', { event })}
            onJoin={() => console.log('Join event:', event.id)}
          />
        ))}
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Browse by Sport
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Chip
              key={category}
              selected={selectedCategory === category}
              onPress={() => setSelectedCategory(category)}
              style={styles.categoryChip}
              textStyle={{
                color: selectedCategory === category ? '#FFFFFF' : '#FF6B35',
              }}
              selectedColor="#FF6B35"
            >
              {category}
            </Chip>
          ))}
        </ScrollView>
      </View>

      {/* Trending Sports */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Trending Sports
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SportsInfo')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trendingSports}
          renderItem={renderSportCard}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sportsContainer}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Recent Activity
        </Text>
        <Card style={styles.activityCard}>
          <Card.Content>
            <View style={styles.activityItem}>
              <Avatar.Icon size={40} icon="trophy" style={styles.activityIcon} />
              <View style={styles.activityText}>
                <Text variant="bodyMedium" style={styles.activityTitle}>
                  Achievement Unlocked!
                </Text>
                <Text variant="bodySmall" style={styles.activitySubtitle}>
                  First Marathon Completed 🏃‍♂️
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.activityTime}>
                2h ago
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Avatar.Icon size={40} icon="account-plus" style={styles.activityIcon} />
              <View style={styles.activityText}>
                <Text variant="bodyMedium" style={styles.activityTitle}>
                  New Friend Added
                </Text>
                <Text variant="bodySmall" style={styles.activitySubtitle}>
                  Rohit Sharma joined your network
                </Text>
              </View>
              <Text variant="bodySmall" style={styles.activityTime}>
                1d ago
              </Text>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Weekly Goal */}
      <View style={styles.section}>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Weekly Goal Progress
        </Text>
        <Card style={styles.goalCard}>
          <Card.Content>
            <View style={styles.goalHeader}>
              <Text variant="titleMedium">5 Events This Week</Text>
              <Text variant="bodyLarge" style={styles.goalProgress}>3/5</Text>
            </View>
            <ProgressBar progress={0.6} style={styles.progressBar} color="#FF6B35" />
            <Text variant="bodySmall" style={styles.goalDescription}>
              Great job! 2 more events to reach your weekly goal.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    color: '#6B7280',
    fontWeight: '500',
  },
  appName: {
    color: '#FF6B35',
    fontWeight: 'bold',
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  seeAllText: {
    color: '#FF6B35',
    fontWeight: '600',
    fontSize: 14,
  },
  statsContainer: {
    paddingHorizontal: 16,
  },
  statCard: {
    width: 100,
    height: 100,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  statIcon: {
    margin: 0,
    borderRadius: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 4,
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 10,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#FFFFFF',
  },
  sportsContainer: {
    paddingHorizontal: 16,
  },
  sportCard: {
    width: 140,
    height: 80,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sportGradient: {
    flex: 1,
    padding: 12,
    justifyContent: 'flex-end',
  },
  sportName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  sportCategory: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  activityCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIcon: {
    backgroundColor: '#FF6B3515',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  activitySubtitle: {
    color: '#6B7280',
    marginTop: 2,
  },
  activityTime: {
    color: '#6B7280',
  },
  goalCard: {
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalProgress: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  goalDescription: {
    color: '#6B7280',
  },
});

export default HomeScreen;
