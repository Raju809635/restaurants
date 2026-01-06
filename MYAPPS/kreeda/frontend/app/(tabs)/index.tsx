import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredNews = [
    {
      id: '1',
      title: 'Indian Hockey Team Wins Asian Champions Trophy',
      summary: 'Historic victory against Malaysia in the final match',
      author: 'Sports India',
      publishedAt: '2024-01-15',
      image: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Hockey',
      readTime: 4,
    },
    {
      id: '2',
      title: 'Neeraj Chopra Breaks National Record Again',
      summary: 'Javelin throw champion sets new benchmark at Diamond League',
      author: 'Athletics Today',
      publishedAt: '2024-01-14',
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Athletics',
      readTime: 3,
    },
    {
      id: '3',
      title: 'Kabaddi World Cup 2024 Schedule Announced',
      summary: 'India to host the prestigious tournament in Mumbai',
      author: 'Kabaddi Federation',
      publishedAt: '2024-01-13',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'Kabaddi',
      readTime: 5,
    },
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Mumbai Marathon 2024',
      date: '2024-02-18',
      location: 'Marine Drive, Mumbai',
      participants: 45000,
      sport: 'Running',
      city: 'Mumbai',
    },
    {
      id: '2',
      title: 'Delhi Premier League Cricket',
      date: '2024-02-22',
      location: 'Feroz Shah Kotla Stadium',
      participants: 200,
      sport: 'Cricket',
      city: 'Delhi',
    },
    {
      id: '3',
      title: 'Bangalore Badminton Championship',
      date: '2024-02-25',
      location: 'Kanteerava Stadium',
      participants: 128,
      sport: 'Badminton',
      city: 'Bangalore',
    },
  ];

  const quickActions = [
    {
      id: '1',
      title: 'Find Events',
      icon: 'calendar', // changed from 'calendar-outline'
      iconLib: Ionicons,
      color: '#FF6B35',
      description: 'Local tournaments & matches',
      action: () => Alert.alert('Find Events', 'Navigate to Events tab to discover local tournaments and matches near you!'),
    },
    {
      id: '2',
      title: 'AI Coach',
      icon: 'chatbubbles', // changed from 'chatbubbles-outline'
      iconLib: Ionicons,
      color: '#138808',
      description: 'Training guidance in Hindi',
      action: () => Alert.alert('AI Coach', 'Navigate to AI Coach tab to get personalized training guidance in Hindi!'),
    },
    {
      id: '3',
      title: 'Find Grounds',
      icon: 'map-pin',
      iconLib: Feather,
      color: '#FF9933',
      description: 'Nearby sports facilities',
      action: () => Alert.alert('Find Grounds', 'Ground finder feature coming soon! Find nearby sports facilities and stadiums.'),
    },
    {
      id: '4',
      title: 'My Progress',
      icon: 'trending-up',
      iconLib: Feather,
      color: '#000080',
      description: 'Track your achievements',
      action: () => Alert.alert('My Progress', 'Navigate to Profile tab to track your sports achievements and progress!'),
    },
  ];

  const trendingSports = [
    { name: 'Cricket', icon: '🏏', growth: '+15%' },
    { name: 'Kabaddi', icon: '🤼', growth: '+28%' },
    { name: 'Badminton', icon: '🏸', growth: '+12%' },
    { name: 'Hockey', icon: '🏑', growth: '+8%' },
  ];

  const handleNewsPress = (article: any) => {
    Alert.alert(
      article.title,
      `${article.summary}\n\nBy: ${article.author}\nCategory: ${article.category}\nRead Time: ${article.readTime} minutes`,
      [{ text: 'OK' }]
    );
  };

  const handleEventPress = (event: any) => {
    Alert.alert(
      event.title,
      `Date: ${new Date(event.date).toLocaleDateString('hi-IN')}\nLocation: ${event.location}\nParticipants: ${event.participants.toLocaleString('hi-IN')}\nSport: ${event.sport}`,
      [{ text: 'OK' }]
    );
  };

  const handleNotificationPress = () => {
    Alert.alert(
      'Notifications',
      '🔔 New event near you: Pune Cricket Tournament\n🏆 Achievement unlocked: 5 events joined\n📰 Latest news: India wins Hockey Championship',
      [{ text: 'OK' }]
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert(
        'Search Results',
        `Searching for: "${searchQuery}"\n\nResults would include:\n• Events matching your query\n• Sports information\n• Nearby facilities\n• Training programs`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#FF9933', '#FFFFFF', '#138808']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greeting}>नमस्ते,</Text>
                <Text style={styles.userName}>Arjun Sharma</Text>
              </View>
              <TouchableOpacity style={styles.notificationButton} onPress={handleNotificationPress}>
                <Ionicons name="notifications-outline" size={24} color="#374151" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder="खेल, इवेंट्स, मैदान खोजें..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={handleSearch}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Sports</Text>
            <MaterialCommunityIcons name="fire" size={20} color="#FF6B35" />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.trendingContainer}>
              {trendingSports.map((sport, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.trendingCard}
                  onPress={() => Alert.alert(sport.name, `${sport.name} is trending with ${sport.growth} growth this month!`)}
                >
                  <Text style={styles.sportIcon}>{sport.icon}</Text>
                  <Text style={styles.sportName}>{sport.name}</Text>
                  <Text style={styles.sportGrowth}>{sport.growth}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                activeOpacity={0.7}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}> 
                  {action.iconLib === Ionicons && <Ionicons name={action.icon as any} size={24} color={action.color} />}
                  {action.iconLib === Feather && <Feather name={action.icon as any} size={24} color={action.color} />}
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sports News</Text>
            <TouchableOpacity onPress={() => Alert.alert('All News', 'Navigate to news section to see all sports news!')}>
              <Text style={styles.seeAllButton}>सभी देखें</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {featuredNews.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.newsCard}
                activeOpacity={0.8}
                onPress={() => handleNewsPress(article)}
              >
                <Image source={{ uri: article.image }} style={styles.newsImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.newsGradient}
                />
                <View style={styles.newsContent}>
                  <View style={styles.newsCategory}>
                    <Text style={styles.newsCategoryText}>{article.category}</Text>
                  </View>
                  <Text style={styles.newsTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsAuthor}>{article.author}</Text>
                    <Text style={styles.newsReadTime}>{article.readTime} मिनट</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity onPress={() => Alert.alert('All Events', 'Navigate to Events tab to see all upcoming events!')}>
              <Text style={styles.seeAllButton}>सभी देखें</Text>
            </TouchableOpacity>
          </View>
          {upcomingEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={styles.eventCard}
              activeOpacity={0.8}
              onPress={() => handleEventPress(event)}
            >
              <View style={styles.eventDate}>
                <Text style={styles.eventDateText}>
                  {new Date(event.date).getDate()}
                </Text>
                <Text style={styles.eventMonthText}>
                  {new Date(event.date).toLocaleDateString('hi-IN', { month: 'short' })}
                </Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <View style={styles.eventMeta}>
                  <View style={styles.eventMetaItem}>
                    <Feather name="map-pin" size={14} color="#6B7280" />
                    <Text style={styles.eventMetaText}>{event.location}</Text>
                  </View>
                  <View style={styles.eventMetaItem}>
                    <FontAwesome5 name="users" size={14} color="#6B7280" />
                    <Text style={styles.eventMetaText}>{event.participants.toLocaleString('hi-IN')} प्रतिभागी</Text>
                  </View>
                </View>
              </View>
              <View style={styles.eventAction}>
                <Text style={styles.eventSport}>{event.sport}</Text>
                <Text style={styles.eventCity}>{event.city}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => Alert.alert('Achievements', 'You have 8 achievements! Keep participating in events to earn more.')}
            >
              <MaterialCommunityIcons name="trophy" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>उपलब्धियां</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => Alert.alert('Events', 'You have participated in 12 events! Join more events to improve your skills.')}
            >
              <Ionicons name="calendar" size={24} color="#FF6B35" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>इवेंट्स</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.statCard}
              onPress={() => Alert.alert('XP Points', 'You have 1,850 XP points! Earn more by participating in events and completing challenges.')}
            >
              <FontAwesome5 name="star" size={24} color="#138808" />
              <Text style={styles.statNumber}>1,850</Text>
              <Text style={styles.statLabel}>XP पॉइंट्स</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "खेल में जीत-हार होती रहती है, लेकिन खेल भावना हमेशा जीतनी चाहिए।"
            </Text>
            <Text style={styles.quoteAuthor}>- भारतीय खेल दर्शन</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerGradient: {
    paddingBottom: 2,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    color: '#111827',
    fontWeight: '700',
    marginTop: 2,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAllButton: {
    fontSize: 16,
    color: '#FF6B35',
    fontWeight: '600',
  },
  trendingContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  trendingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sportIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  sportName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  sportGrowth: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 56) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  newsCard: {
    width: 280,
    height: 200,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  newsGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  newsContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  newsCategory: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newsCategoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsAuthor: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '500',
  },
  newsReadTime: {
    color: '#E5E7EB',
    fontSize: 12,
    fontWeight: '500',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  eventDate: {
    width: 60,
    height: 60,
    backgroundColor: '#FF6B35',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  eventDateText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  eventMonthText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  eventMeta: {
    gap: 8,
  },
  eventMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eventMetaText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  eventAction: {
    alignItems: 'flex-end',
  },
  eventSport: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    backgroundColor: '#FFF4F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 4,
  },
  eventCity: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'right',
  },
});