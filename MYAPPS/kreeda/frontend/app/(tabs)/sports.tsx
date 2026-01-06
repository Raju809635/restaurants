import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, Medal, Globe, Users, Trophy, Star, Flag } from 'lucide-react-native';

export default function SportsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Traditional', 'Olympic', 'Popular', 'Regional'];

  const sports = [
    {
      id: '1',
      name: 'Cricket',
      category: 'Popular',
      description: 'भारत का सबसे लोकप्रिय खेल - The gentleman\'s game',
      image: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '100M+',
      olympicStatus: 'Proposed',
      worldRecord: 'Highest ODI Score: 498/4',
      popularStates: ['Mumbai', 'Chennai', 'Kolkata', 'Bangalore'],
      rating: 4.9,
      indianLegends: ['Sachin Tendulkar', 'MS Dhoni', 'Virat Kohli'],
      traditionalName: 'क्रिकेट',
    },
    {
      id: '2',
      name: 'Kabaddi',
      category: 'Traditional',
      description: 'भारत का पारंपरिक खेल - Ancient contact sport',
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '50M+',
      olympicStatus: 'Asian Games',
      worldRecord: 'Pro Kabaddi League Record',
      popularStates: ['Punjab', 'Haryana', 'Tamil Nadu', 'Maharashtra'],
      rating: 4.7,
      indianLegends: ['Anup Kumar', 'Rahul Chaudhari', 'Pardeep Narwal'],
      traditionalName: 'कबड्डी',
    },
    {
      id: '3',
      name: 'Badminton',
      category: 'Olympic',
      description: 'भारतीय शटलकॉक चैंपियन्स का खेल',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '25M+',
      olympicStatus: 'Summer Olympics',
      worldRecord: 'BWF World Championships',
      popularStates: ['Hyderabad', 'Bangalore', 'Chennai', 'Guwahati'],
      rating: 4.8,
      indianLegends: ['P.V. Sindhu', 'Saina Nehwal', 'Kidambi Srikanth'],
      traditionalName: 'बैडमिंटन',
    },
    {
      id: '4',
      name: 'Hockey',
      category: 'Olympic',
      description: 'भारत का राष्ट्रीय खेल - National sport of India',
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '15M+',
      olympicStatus: 'Summer Olympics',
      worldRecord: '8 Olympic Gold Medals',
      popularStates: ['Punjab', 'Haryana', 'Odisha', 'Jharkhand'],
      rating: 4.6,
      indianLegends: ['Dhyan Chand', 'Dhanraj Pillay', 'Manpreet Singh'],
      traditionalName: 'हॉकी',
    },
    {
      id: '5',
      name: 'Wrestling',
      category: 'Traditional',
      description: 'कुश्ती - Ancient Indian martial art',
      image: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '20M+',
      olympicStatus: 'Summer Olympics',
      worldRecord: 'World Wrestling Championships',
      popularStates: ['Haryana', 'Punjab', 'Delhi', 'UP'],
      rating: 4.7,
      indianLegends: ['Sushil Kumar', 'Yogeshwar Dutt', 'Bajrang Punia'],
      traditionalName: 'कुश्ती',
    },
    {
      id: '6',
      name: 'Kho Kho',
      category: 'Traditional',
      description: 'खो खो - Traditional Indian tag sport',
      image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=800',
      participants: '10M+',
      olympicStatus: 'Asian Games',
      worldRecord: 'Kho Kho World Cup',
      popularStates: ['Maharashtra', 'Gujarat', 'MP', 'Karnataka'],
      rating: 4.5,
      indianLegends: ['Sarika Kale', 'Priyanka Ingle', 'Nasreen Shaikh'],
      traditionalName: 'खो खो',
    },
  ];

  const filteredSports = sports.filter(sport => {
    const matchesSearch = sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sport.traditionalName.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || sport.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const indianSportsHighlights = [
    {
      id: '1',
      title: 'Asian Games 2023',
      subtitle: 'India\'s Medal Tally & Highlights',
      image: 'https://images.pexels.com/photos/2306209/pexels-photo-2306209.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Recent',
      medals: '107 Medals',
    },
    {
      id: '2',
      title: 'Commonwealth Games 2022',
      subtitle: 'India\'s Best Performance',
      image: 'https://images.pexels.com/photos/848612/pexels-photo-848612.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'Historic',
      medals: '61 Medals',
    },
  ];

  const handleSportPress = (sport: any) => {
    Alert.alert(
      sport.name,
      `${sport.description}\n\nParticipants: ${sport.participants}\nOlympic Status: ${sport.olympicStatus}\nRating: ${sport.rating}/5\n\nIndian Legends:\n${sport.indianLegends.join('\n')}\n\nPopular in: ${sport.popularStates.join(', ')}`,
      [{ text: 'OK' }]
    );
  };

  const handleHighlightPress = (highlight: any) => {
    Alert.alert(
      highlight.title,
      `${highlight.subtitle}\n\nStatus: ${highlight.status}\nMedals Won: ${highlight.medals}\n\nIndia's performance in international sports competitions continues to improve!`,
      [{ text: 'OK' }]
    );
  };

  const handleFilter = () => {
    Alert.alert(
      'Filter Sports',
      'Filter options:\n• By Category (Traditional, Olympic, Popular)\n• By Participants Count\n• By Olympic Status\n• By Rating',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>भारतीय खेल</Text>
              <Text style={styles.headerSubtitle}>Indian Sports Information</Text>
            </View>
            <Flag size={24} color="#FF6B35" strokeWidth={2} />
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="खेल खोजें / Search sports..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
              <Filter size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Indian Sports Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {indianSportsHighlights.map((highlight) => (
              <TouchableOpacity
                key={highlight.id}
                style={styles.highlightCard}
                activeOpacity={0.8}
                onPress={() => handleHighlightPress(highlight)}
              >
                <Image source={{ uri: highlight.image }} style={styles.highlightImage} />
                <View style={styles.highlightOverlay}>
                  <View style={styles.highlightStatus}>
                    <Medal size={16} color="#FFFFFF" strokeWidth={2} />
                    <Text style={styles.highlightStatusText}>{highlight.status}</Text>
                  </View>
                  <Text style={styles.highlightTitle}>{highlight.title}</Text>
                  <Text style={styles.highlightSubtitle}>{highlight.subtitle}</Text>
                  <View style={styles.medalBadge}>
                    <Trophy size={14} color="#FFD700" strokeWidth={2} />
                    <Text style={styles.medalText}>{highlight.medals}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryContainer}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sportsGrid}>
            {filteredSports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={styles.sportCard}
                activeOpacity={0.8}
                onPress={() => handleSportPress(sport)}
              >
                <Image source={{ uri: sport.image }} style={styles.sportImage} />
                
                <View style={styles.sportContent}>
                  <View style={styles.sportHeader}>
                    <View>
                      <Text style={styles.sportName}>{sport.name}</Text>
                      <Text style={styles.sportTraditionalName}>{sport.traditionalName}</Text>
                    </View>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={2} />
                      <Text style={styles.rating}>{sport.rating}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.sportDescription} numberOfLines={2}>
                    {sport.description}
                  </Text>
                  
                  <View style={styles.sportStats}>
                    <View style={styles.statItem}>
                      <Users size={14} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.statText}>{sport.participants}</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Globe size={14} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.statText}>{sport.olympicStatus}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.legendsSection}>
                    <Text style={styles.legendsTitle}>Indian Legends:</Text>
                    <View style={styles.legendsList}>
                      {sport.indianLegends.slice(0, 2).map((legend, index) => (
                        <View key={legend} style={styles.legendTag}>
                          <Text style={styles.legendText}>{legend}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                  
                  <View style={styles.sportFooter}>
                    <View style={styles.statesContainer}>
                      <Text style={styles.statesTitle}>Popular in:</Text>
                      <View style={styles.statesList}>
                        {sport.popularStates.slice(0, 2).map((state, index) => (
                          <View key={state} style={styles.stateTag}>
                            <Text style={styles.stateText}>{state}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                    <TouchableOpacity 
                      style={styles.learnMoreButton}
                      onPress={() => handleSportPress(sport)}
                    >
                      <Text style={styles.learnMoreText}>और जानें</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>भारतीय खेल आंकड़े</Text>
          <View style={styles.quickStatsGrid}>
            <TouchableOpacity 
              style={styles.quickStatCard}
              onPress={() => Alert.alert('Olympic Medals', 'India has won 28 Olympic medals in total, with recent success in shooting, wrestling, and badminton!')}
            >
              <Trophy size={24} color="#FFD700" strokeWidth={2} />
              <Text style={styles.quickStatNumber}>28</Text>
              <Text style={styles.quickStatLabel}>Olympic Medals</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickStatCard}
              onPress={() => Alert.alert('Traditional Sports', 'India has 15+ traditional sports including Kabaddi, Kho Kho, Mallakhamb, and many more!')}
            >
              <Medal size={24} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.quickStatNumber}>15+</Text>
              <Text style={styles.quickStatLabel}>Traditional Sports</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickStatCard}
              onPress={() => Alert.alert('States Playing', 'All 29 states and union territories of India actively participate in various sports!')}
            >
              <Globe size={24} color="#138808" strokeWidth={2} />
              <Text style={styles.quickStatNumber}>29</Text>
              <Text style={styles.quickStatLabel}>States Playing</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "खेल केवल शरीर का नहीं, मन और आत्मा का भी विकास करता है।"
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
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 2,
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
  filterButton: {
    padding: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  highlightCard: {
    width: 280,
    height: 180,
    borderRadius: 16,
    marginRight: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  highlightImage: {
    width: '100%',
    height: '100%',
  },
  highlightOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 16,
  },
  highlightStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  highlightStatusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  highlightTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  highlightSubtitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  medalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  medalText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryButtonActive: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  sportsGrid: {
    gap: 16,
  },
  sportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sportImage: {
    width: '100%',
    height: 180,
  },
  sportContent: {
    padding: 16,
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  sportName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  sportTraditionalName: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
    marginTop: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  sportDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  sportStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  legendsSection: {
    marginBottom: 12,
  },
  legendsTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 6,
  },
  legendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  legendTag: {
    backgroundColor: '#FFF4F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF6B35',
  },
  legendText: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '600',
  },
  sportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statesContainer: {
    flex: 1,
  },
  statesTitle: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginBottom: 6,
  },
  statesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  stateTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  stateText: {
    fontSize: 10,
    color: '#138808',
    fontWeight: '600',
  },
  learnMoreButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
  },
  learnMoreText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickStatsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  quickStatCard: {
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
  quickStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  quickStatLabel: {
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