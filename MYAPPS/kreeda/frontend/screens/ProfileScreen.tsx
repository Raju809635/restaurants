import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import {
  Text,
  Avatar,
  Card,
  Button,
  Chip,
  Surface,
  IconButton,
  Divider,
  ProgressBar,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio: string;
  location: string;
  age: number;
  joinDate: string;
  sports: string[];
  achievements: Achievement[];
  stats: UserStats;
  friends: number;
  eventsJoined: number;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface UserStats {
  totalEvents: number;
  completedEvents: number;
  winRate: number;
  favoritesSport: string;
  hoursPlayed: number;
  distanceCovered: number;
}

const ProfileScreen = ({ navigation }: { navigation: any }) => {
  const [user] = useState<UserProfile>({
    id: '1',
    name: 'Arjun Sharma',
    email: 'arjun.sharma@example.com',
    bio: 'Passionate cricket player and sports enthusiast. Love participating in community events! 🏏',
    location: 'Mumbai, Maharashtra',
    age: 28,
    joinDate: '2023-06-15',
    sports: ['Cricket', 'Football', 'Running', 'Kabaddi', 'Basketball'],
    achievements: [
      {
        id: '1',
        title: 'First Marathon',
        description: 'Completed your first marathon',
        icon: 'run',
        unlockedAt: '2024-01-10',
        rarity: 'rare'
      },
      {
        id: '2',
        title: 'Cricket Champion',
        description: 'Won 10 cricket matches',
        icon: 'cricket',
        unlockedAt: '2024-01-05',
        rarity: 'epic'
      },
      {
        id: '3',
        title: 'Social Butterfly',
        description: 'Made 25+ friends',
        icon: 'account-group',
        unlockedAt: '2023-12-20',
        rarity: 'common'
      }
    ],
    stats: {
      totalEvents: 45,
      completedEvents: 38,
      winRate: 72,
      favoritesSport: 'Cricket',
      hoursPlayed: 156,
      distanceCovered: 485 // km
    },
    friends: 24,
    eventsJoined: 12,
    level: 15,
    xp: 2450,
    nextLevelXp: 3000
  });

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { profile: user });
  };

  const handleSettings = () => {
    // Navigate to settings
    Alert.alert('Settings', 'Settings screen not implemented yet');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          // Handle logout
          console.log('User logged out');
        }}
      ]
    );
  };

  const progressPercentage = (user.xp / user.nextLevelXp) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={['#FF6B35', '#F59E0B']}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={handleSettings}
          >
            <IconButton icon="cog" iconColor="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.profileInfo}>
            <Avatar.Image
              size={100}
              source={user.avatar ? { uri: user.avatar } : require('../assets/default-avatar.png')}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.userLocation}>
              📍 {user.location}
            </Text>
            
            {/* Level and XP */}
            <View style={styles.levelContainer}>
              <Text variant="titleMedium" style={styles.levelText}>
                Level {user.level}
              </Text>
              <View style={styles.xpContainer}>
                <ProgressBar 
                  progress={progressPercentage / 100}
                  style={styles.xpBar}
                  color="#FFFFFF"
                />
                <Text variant="bodySmall" style={styles.xpText}>
                  {user.xp} / {user.nextLevelXp} XP
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Quick Stats */}
      <View style={styles.section}>
        <View style={styles.statsGrid}>
          <Surface style={styles.statCard} elevation={2}>
            <Text variant="titleLarge" style={styles.statValue}>
              {user.stats.totalEvents}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Total Events
            </Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text variant="titleLarge" style={styles.statValue}>
              {user.friends}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Friends
            </Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text variant="titleLarge" style={styles.statValue}>
              {user.stats.winRate}%
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              Win Rate
            </Text>
          </Surface>
          
          <Surface style={styles.statCard} elevation={2}>
            <Text variant="titleLarge" style={styles.statValue}>
              {user.stats.distanceCovered}
            </Text>
            <Text variant="bodySmall" style={styles.statLabel}>
              KM Covered
            </Text>
          </Surface>
        </View>
      </View>

      {/* Bio */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              About Me
            </Text>
            <Text variant="bodyMedium" style={styles.bioText}>
              {user.bio}
            </Text>
            <Text variant="bodySmall" style={styles.joinDate}>
              Member since {new Date(user.joinDate).toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric'
              })}
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Sports Interests */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Sports Interests
              </Text>
              <Button mode="outlined" onPress={() => navigation.navigate('SportsSelection')}>
                Edit
              </Button>
            </View>
            <View style={styles.sportsContainer}>
              {user.sports.map((sport, index) => (
                <Chip key={index} style={styles.sportChip} textStyle={styles.sportChipText}>
                  {sport}
                </Chip>
              ))}
            </View>
            <Text variant="bodySmall" style={styles.favoriteText}>
              Favorite: {user.stats.favoritesSport} 🏆
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent Achievements
              </Text>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('Achievements')}
              >
                View All
              </Button>
            </View>
            {user.achievements.slice(0, 3).map((achievement) => (
              <View key={achievement.id} style={styles.achievementItem}>
                <Surface 
                  style={[
                    styles.achievementIcon,
                    { backgroundColor: `${getAchievementColor(achievement.rarity)}15` }
                  ]}
                  elevation={1}
                >
                  <IconButton
                    icon={achievement.icon}
                    iconColor={getAchievementColor(achievement.rarity)}
                    size={20}
                  />
                </Surface>
                <View style={styles.achievementText}>
                  <Text variant="titleSmall" style={styles.achievementTitle}>
                    {achievement.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
                <Text variant="bodySmall" style={styles.achievementDate}>
                  {new Date(achievement.unlockedAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </Card.Content>
        </Card>
      </View>

      {/* Performance Stats */}
      <View style={styles.section}>
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Performance Stats
            </Text>
            
            <View style={styles.performanceItem}>
              <View style={styles.performanceHeader}>
                <Text variant="bodyMedium">Event Completion Rate</Text>
                <Text variant="bodyMedium" style={styles.performanceValue}>
                  {Math.round((user.stats.completedEvents / user.stats.totalEvents) * 100)}%
                </Text>
              </View>
              <ProgressBar 
                progress={user.stats.completedEvents / user.stats.totalEvents}
                style={styles.performanceBar}
                color="#10B981"
              />
            </View>

            <Divider style={styles.divider} />

            <View style={styles.performanceGrid}>
              <View style={styles.performanceGridItem}>
                <Text variant="titleMedium" style={styles.performanceNumber}>
                  {user.stats.hoursPlayed}
                </Text>
                <Text variant="bodySmall" style={styles.performanceLabel}>
                  Hours Played
                </Text>
              </View>
              <View style={styles.performanceGridItem}>
                <Text variant="titleMedium" style={styles.performanceNumber}>
                  {user.stats.completedEvents}
                </Text>
                <Text variant="bodySmall" style={styles.performanceLabel}>
                  Events Completed
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      </View>

      {/* Action Buttons */}
      <View style={styles.section}>
        <Button
          mode="contained"
          onPress={handleEditProfile}
          style={styles.editButton}
          contentStyle={styles.buttonContent}
        >
          Edit Profile
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.buttonContent}
          textColor="#EF4444"
        >
          Logout
        </Button>
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
    paddingTop: 60,
    paddingBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  settingsButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginBottom: 16,
  },
  userName: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userLocation: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  levelContainer: {
    alignItems: 'center',
    width: '100%',
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 8,
  },
  xpContainer: {
    width: '80%',
    alignItems: 'center',
  },
  xpBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 4,
  },
  xpText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -20,
  },
  statCard: {
    width: (width - 60) / 4,
    height: 80,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#FF6B35',
    textAlign: 'center',
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#111827',
  },
  bioText: {
    color: '#6B7280',
    lineHeight: 22,
    marginBottom: 12,
  },
  joinDate: {
    color: '#9CA3AF',
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  sportChip: {
    backgroundColor: '#FF6B3515',
    marginRight: 8,
    marginBottom: 8,
  },
  sportChipText: {
    color: '#FF6B35',
  },
  favoriteText: {
    color: '#6B7280',
    fontStyle: 'italic',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  achievementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontWeight: '600',
    color: '#111827',
  },
  achievementDescription: {
    color: '#6B7280',
    marginTop: 2,
  },
  achievementDate: {
    color: '#9CA3AF',
  },
  performanceItem: {
    marginBottom: 16,
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  performanceValue: {
    fontWeight: '600',
    color: '#10B981',
  },
  performanceBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  divider: {
    marginVertical: 16,
  },
  performanceGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  performanceGridItem: {
    alignItems: 'center',
  },
  performanceNumber: {
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  performanceLabel: {
    color: '#6B7280',
    marginTop: 4,
  },
  editButton: {
    marginBottom: 12,
    backgroundColor: '#FF6B35',
  },
  logoutButton: {
    borderColor: '#EF4444',
    marginBottom: 20,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

export default ProfileScreen;
