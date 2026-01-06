import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Surface,
  ProgressBar,
  IconButton,
  Chip,
  Avatar,
  Button,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  requirements: string[];
}

interface AchievementStats {
  totalAchievements: number;
  unlockedAchievements: number;
  totalXP: number;
  completionRate: number;
  recentUnlocks: number;
}

const AchievementsScreen = ({ navigation }: { navigation: any }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Join your first sports event',
      icon: 'walk',
      rarity: 'common',
      category: 'Getting Started',
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      unlockedAt: '2024-01-01',
      xpReward: 50,
      requirements: ['Join 1 event']
    },
    {
      id: '2',
      title: 'Marathon Master',
      description: 'Complete your first marathon',
      icon: 'run',
      rarity: 'rare',
      category: 'Running',
      progress: 1,
      maxProgress: 1,
      isUnlocked: true,
      unlockedAt: '2024-01-10',
      xpReward: 200,
      requirements: ['Complete a marathon event']
    },
    {
      id: '3',
      title: 'Cricket Champion',
      description: 'Win 10 cricket matches',
      icon: 'cricket',
      rarity: 'epic',
      category: 'Cricket',
      progress: 10,
      maxProgress: 10,
      isUnlocked: true,
      unlockedAt: '2024-01-05',
      xpReward: 500,
      requirements: ['Win 10 cricket matches']
    },
    {
      id: '4',
      title: 'Social Butterfly',
      description: 'Make 25+ friends in the community',
      icon: 'account-group',
      rarity: 'common',
      category: 'Social',
      progress: 24,
      maxProgress: 25,
      isUnlocked: false,
      xpReward: 150,
      requirements: ['Add 25 friends']
    },
    {
      id: '5',
      title: 'Event Organizer',
      description: 'Organize 5 successful events',
      icon: 'calendar-plus',
      rarity: 'epic',
      category: 'Leadership',
      progress: 3,
      maxProgress: 5,
      isUnlocked: false,
      xpReward: 400,
      requirements: ['Organize 5 events', 'Min 10 participants each']
    },
    {
      id: '6',
      title: 'Legendary Athlete',
      description: 'Master 5 different sports',
      icon: 'trophy-variant',
      rarity: 'legendary',
      category: 'Mastery',
      progress: 3,
      maxProgress: 5,
      isUnlocked: false,
      xpReward: 1000,
      requirements: ['Reach expert level in 5 different sports']
    },
    {
      id: '7',
      title: 'Distance Warrior',
      description: 'Cover 500KM in running events',
      icon: 'speedometer',
      rarity: 'rare',
      category: 'Running',
      progress: 485,
      maxProgress: 500,
      isUnlocked: false,
      xpReward: 300,
      requirements: ['Run total 500KM across all events']
    },
    {
      id: '8',
      title: 'Comeback King',
      description: 'Win a match after being behind',
      icon: 'arrow-up-bold',
      rarity: 'epic',
      category: 'Special',
      progress: 0,
      maxProgress: 1,
      isUnlocked: false,
      xpReward: 350,
      requirements: ['Win a match from losing position']
    }
  ];

  const stats: AchievementStats = {
    totalAchievements: achievements.length,
    unlockedAchievements: achievements.filter(a => a.isUnlocked).length,
    totalXP: achievements.filter(a => a.isUnlocked).reduce((sum, a) => sum + a.xpReward, 0),
    completionRate: (achievements.filter(a => a.isUnlocked).length / achievements.length) * 100,
    recentUnlocks: 2
  };

  const categories = ['All', 'Getting Started', 'Running', 'Cricket', 'Social', 'Leadership', 'Mastery', 'Special'];

  const filteredAchievements = selectedCategory === 'All' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#10B981';
      case 'rare': return '#3B82F6';
      case 'epic': return '#8B5CF6';
      case 'legendary': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const getRarityBg = (rarity: string) => {
    switch (rarity) {
      case 'common': return ['#10B981', '#059669'];
      case 'rare': return ['#3B82F6', '#2563EB'];
      case 'epic': return ['#8B5CF6', '#7C3AED'];
      case 'legendary': return ['#F59E0B', '#D97706'];
      default: return ['#6B7280', '#4B5563'];
    }
  };

  const renderStatsCard = ({ item, index }: { item: any, index: number }) => {
    const statItems = [
      { label: 'Total', value: stats.totalAchievements, icon: 'trophy-outline' },
      { label: 'Unlocked', value: stats.unlockedAchievements, icon: 'trophy' },
      { label: 'Total XP', value: stats.totalXP, icon: 'star' },
      { label: 'Recent', value: stats.recentUnlocks, icon: 'clock-outline' }
    ];
    
    const stat = statItems[index];
    
    return (
      <Surface style={styles.statCard} elevation={2}>
        <View style={styles.statContent}>
          <IconButton icon={stat.icon} size={24} iconColor="#FF6B35" />
          <Text variant="titleLarge" style={styles.statValue}>
            {stat.value}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            {stat.label}
          </Text>
        </View>
      </Surface>
    );
  };

  const renderAchievement = ({ item }: { item: Achievement }) => {
    const progressPercentage = (item.progress / item.maxProgress) * 100;
    const isCompleted = item.isUnlocked;
    
    return (
      <TouchableOpacity
        style={[styles.achievementCard, !isCompleted && styles.lockedCard]}
        onPress={() => {
          // Show achievement details modal
          console.log('Show achievement details:', item.title);
        }}
      >
        <Card style={[styles.card, !isCompleted && styles.lockedCardBg]}>
          <LinearGradient
            colors={isCompleted ? getRarityBg(item.rarity) : ['#E5E7EB', '#D1D5DB']}
            style={styles.cardGradient}
          >
            <Card.Content style={styles.cardContent}>
              <View style={styles.achievementHeader}>
                <Surface 
                  style={[
                    styles.iconContainer,
                    { backgroundColor: isCompleted ? '#FFFFFF20' : '#6B728020' }
                  ]}
                  elevation={isCompleted ? 2 : 0}
                >
                  <IconButton
                    icon={item.icon}
                    size={32}
                    iconColor={isCompleted ? '#FFFFFF' : '#6B7280'}
                  />
                </Surface>
                
                <View style={styles.achievementInfo}>
                  <View style={styles.titleRow}>
                    <Text 
                      variant="titleMedium" 
                      style={[styles.achievementTitle, { color: isCompleted ? '#FFFFFF' : '#6B7280' }]}
                    >
                      {item.title}
                    </Text>
                    <Chip 
                      style={[
                        styles.rarityChip,
                        { backgroundColor: isCompleted ? '#FFFFFF20' : '#6B728020' }
                      ]}
                      textStyle={{
                        color: isCompleted ? '#FFFFFF' : '#6B7280',
                        fontSize: 10,
                        fontWeight: '600'
                      }}
                    >
                      {item.rarity.toUpperCase()}
                    </Chip>
                  </View>
                  
                  <Text 
                    variant="bodySmall" 
                    style={[styles.achievementDescription, { color: isCompleted ? '#FFFFFF90' : '#9CA3AF' }]}
                  >
                    {item.description}
                  </Text>
                  
                  {!isCompleted && (
                    <View style={styles.progressSection}>
                      <View style={styles.progressHeader}>
                        <Text variant="bodySmall" style={styles.progressText}>
                          Progress: {item.progress}/{item.maxProgress}
                        </Text>
                        <Text variant="bodySmall" style={styles.progressPercentage}>
                          {Math.round(progressPercentage)}%
                        </Text>
                      </View>
                      <ProgressBar
                        progress={progressPercentage / 100}
                        style={styles.progressBar}
                        color={getRarityColor(item.rarity)}
                      />
                    </View>
                  )}
                  
                  <View style={styles.achievementFooter}>
                    {isCompleted && item.unlockedAt && (
                      <Text variant="bodySmall" style={styles.unlockedDate}>
                        Unlocked {new Date(item.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                    <Text 
                      variant="bodySmall" 
                      style={[styles.xpReward, { color: isCompleted ? '#FFFFFF' : '#FF6B35' }]}
                    >
                      +{item.xpReward} XP
                    </Text>
                  </View>
                </View>
              </View>
            </Card.Content>
          </LinearGradient>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.headerTitle}>
            Achievements
          </Text>
          <Text variant="bodyMedium" style={styles.headerSubtitle}>
            उपलब्धियाँ - Track your sports milestones and progress
          </Text>
        </View>

        {/* Overall Progress */}
        <View style={styles.section}>
          <Card style={styles.progressCard}>
            <LinearGradient
              colors={['#FF6B35', '#F59E0B']}
              style={styles.progressCardGradient}
            >
              <Card.Content>
                <View style={styles.overallProgress}>
                  <Text variant="headlineSmall" style={styles.completionTitle}>
                    {Math.round(stats.completionRate)}% Complete
                  </Text>
                  <Text variant="bodyMedium" style={styles.completionSubtitle}>
                    {stats.unlockedAchievements} of {stats.totalAchievements} achievements unlocked
                  </Text>
                  <ProgressBar
                    progress={stats.completionRate / 100}
                    style={styles.overallProgressBar}
                    color="#FFFFFF"
                  />
                </View>
              </Card.Content>
            </LinearGradient>
          </Card>
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <FlatList
            data={[{}, {}, {}, {}]} // Placeholder data for 4 stat cards
            renderItem={renderStatsCard}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsContainer}
          />
        </View>

        {/* Category Filter */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Categories
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
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.selectedCategoryChip
                ]}
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

        {/* Achievements List */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {selectedCategory} Achievements ({filteredAchievements.length})
          </Text>
          <FlatList
            data={filteredAchievements}
            renderItem={renderAchievement}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.achievementsList}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  progressCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  progressCardGradient: {
    padding: 20,
  },
  overallProgress: {
    alignItems: 'center',
  },
  completionTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  completionSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  overallProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
  },
  statsContainer: {
    paddingRight: 20,
  },
  statCard: {
    width: (width - 80) / 4,
    height: 100,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: '#FF6B35',
    marginTop: -8,
  },
  statLabel: {
    color: '#6B7280',
    textAlign: 'center',
    fontSize: 10,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedCategoryChip: {
    backgroundColor: '#FF6B35',
  },
  achievementsList: {
    paddingBottom: 20,
  },
  achievementCard: {
    marginBottom: 16,
  },
  lockedCard: {
    opacity: 0.8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  lockedCardBg: {
    opacity: 0.9,
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  achievementTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  rarityChip: {
    height: 24,
  },
  achievementDescription: {
    lineHeight: 18,
    marginBottom: 12,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    color: '#6B7280',
  },
  progressPercentage: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  unlockedDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  xpReward: {
    fontWeight: '600',
  },
});

export default AchievementsScreen;
