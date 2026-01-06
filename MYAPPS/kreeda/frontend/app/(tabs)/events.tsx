import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Plus,
  Filter,
  Calendar,
  Flag,
} from 'lucide-react-native';
import EventCard from '@/components/EventCard';

export default function EventsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('Upcoming');
  const [joinedEvents, setJoinedEvents] = useState<string[]>([]);

  const tabs = ['Upcoming', 'My Events', 'Past Events'];

  const events = [
    {
      id: '1',
      title: 'Mumbai Marathon 2024',
      description: 'मुंबई की सबसे बड़ी मैराथन - Marine Drive से शुरू होकर Gateway of India तक',
      sport: 'Running',
      date: '2024-02-18',
      startTime: '06:00',
      endTime: '12:00',
      location: {
        name: 'Marine Drive, Mumbai',
        address: 'Marine Drive, Nariman Point, Mumbai, Maharashtra',
      },
      organizer: 'Mumbai Runners Club',
      maxParticipants: 45000,
      currentParticipants: 38500,
      entryFee: 1500,
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      difficulty: 'Advanced',
      category: 'Marathon',
      city: 'Mumbai',
      state: 'Maharashtra',
    },
    {
      id: '2',
      title: 'Delhi Premier League Cricket',
      description: 'दिल्ली की सबसे बड़ी क्रिकेट लीग - T20 format में रोमांचक मुकाबले',
      sport: 'Cricket',
      date: '2024-02-22',
      startTime: '09:00',
      endTime: '18:00',
      location: {
        name: 'Feroz Shah Kotla Stadium',
        address: 'Bahadur Shah Zafar Marg, New Delhi',
      },
      organizer: 'Delhi Cricket Association',
      maxParticipants: 200,
      currentParticipants: 156,
      entryFee: 2500,
      image: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.7,
      difficulty: 'Intermediate',
      category: 'Tournament',
      city: 'Delhi',
      state: 'Delhi',
    },
    {
      id: '3',
      title: 'Bangalore Badminton Championship',
      description: 'कर्नाटक बैडमिंटन चैंपियनशिप - Singles और Doubles categories',
      sport: 'Badminton',
      date: '2024-02-25',
      startTime: '08:00',
      endTime: '17:00',
      location: {
        name: 'Kanteerava Stadium',
        address: 'Kasturba Road, Bangalore, Karnataka',
      },
      organizer: 'Karnataka Badminton Association',
      maxParticipants: 128,
      currentParticipants: 98,
      entryFee: 800,
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.6,
      difficulty: 'Advanced',
      category: 'Championship',
      city: 'Bangalore',
      state: 'Karnataka',
    },
    {
      id: '4',
      title: 'Kolkata Kabaddi League',
      description: 'पश्चिम बंगाल कबड्डी लीग - Traditional Indian sport tournament',
      sport: 'Kabaddi',
      date: '2024-03-02',
      startTime: '10:00',
      endTime: '16:00',
      location: {
        name: 'Netaji Indoor Stadium',
        address: 'Park Circus, Kolkata, West Bengal',
      },
      organizer: 'Bengal Kabaddi Federation',
      maxParticipants: 80,
      currentParticipants: 64,
      entryFee: 1200,
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.9,
      difficulty: 'Intermediate',
      category: 'League',
      city: 'Kolkata',
      state: 'West Bengal',
    },
    {
      id: '5',
      title: 'Chennai Chess Championship',
      description: 'तमिलनाडु शतरंज चैंपियनशिप - Classical and Rapid formats',
      sport: 'Chess',
      date: '2024-03-08',
      startTime: '09:00',
      endTime: '18:00',
      location: {
        name: 'Anna Centenary Library',
        address: 'Kotturpuram, Chennai, Tamil Nadu',
      },
      organizer: 'Tamil Nadu Chess Association',
      maxParticipants: 200,
      currentParticipants: 167,
      entryFee: 500,
      image: 'https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800',
      rating: 4.8,
      difficulty: 'Advanced',
      category: 'Championship',
      city: 'Chennai',
      state: 'Tamil Nadu',
    },
  ];

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const myEvents = events.filter(event => joinedEvents.includes(event.id));

  const handleCreateEvent = () => {
    Alert.alert(
      'Create Event',
      'Event creation feature coming soon! You will be able to create and manage your own sports events.',
      [{ text: 'OK' }]
    );
  };

  const handleJoinEvent = (eventId: string) => {
    if (joinedEvents.includes(eventId)) {
      Alert.alert(
        'Already Joined',
        'You have already joined this event!',
        [{ text: 'OK' }]
      );
      return;
    }

    Alert.alert(
      'Join Event',
      'Are you sure you want to join this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Join',
          onPress: () => {
            setJoinedEvents(prev => [...prev, eventId]);
            Alert.alert('Success', 'You have successfully joined the event!');
          },
        },
      ]
    );
  };

  const handleEventPress = (event: any) => {
    Alert.alert(
      event.title,
      `${event.description}\n\nOrganizer: ${event.organizer}\nLocation: ${event.location.address}\nEntry Fee: ₹${event.entryFee?.toLocaleString('hi-IN') || 'Free'}`,
      [{ text: 'OK' }]
    );
  };

  const handleFilter = () => {
    Alert.alert(
      'Filter Events',
      'Filter options:\n• By Sport\n• By Location\n• By Date\n• By Entry Fee\n• By Difficulty Level',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>भारतीय खेल इवेंट्स</Text>
            <Text style={styles.headerSubtitle}>Indian Sports Events</Text>
          </View>
          <TouchableOpacity style={styles.createEventButton} onPress={handleCreateEvent}>
            <Plus size={20} color="#FFFFFF" strokeWidth={2} />
            <Text style={styles.createEventText}>Create</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="इवेंट्स, खेल, शहर खोजें..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
            <Filter size={20} color="#6B7280" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              selectedTab === tab && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {selectedTab === 'Upcoming' && (
          <View style={styles.eventsContainer}>
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event)}
                onJoin={() => handleJoinEvent(event.id)}
              />
            ))}
          </View>
        )}

        {selectedTab === 'My Events' && (
          <View style={styles.eventsContainer}>
            {myEvents.length === 0 ? (
              <View style={styles.emptyState}>
                <Calendar size={48} color="#9CA3AF" strokeWidth={1} />
                <Text style={styles.emptyStateTitle}>कोई इवेंट नहीं</Text>
                <Text style={styles.emptyStateText}>
                  अपना पहला इवेंट join करें
                </Text>
                <TouchableOpacity 
                  style={styles.exploreButton}
                  onPress={() => setSelectedTab('Upcoming')}
                >
                  <Text style={styles.exploreButtonText}>इवेंट्स देखें</Text>
                </TouchableOpacity>
              </View>
            ) : (
              myEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onPress={() => handleEventPress(event)}
                  onJoin={() => handleJoinEvent(event.id)}
                />
              ))
            )}
          </View>
        )}

        {selectedTab === 'Past Events' && (
          <View style={styles.emptyState}>
            <Flag size={48} color="#9CA3AF" strokeWidth={1} />
            <Text style={styles.emptyStateTitle}>Past Events</Text>
            <Text style={styles.emptyStateText}>
              Your completed events will appear here
            </Text>
          </View>
        )}
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
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  createEventText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginRight: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#FF6B35',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FF6B35',
  },
  content: {
    flex: 1,
  },
  eventsContainer: {
    padding: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});