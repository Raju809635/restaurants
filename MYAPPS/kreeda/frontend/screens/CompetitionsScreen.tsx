import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Button, Chip, Searchbar } from 'react-native-paper';

interface Competition {
  id: string;
  title: string;
  sport: string;
  date: string;
  location: string;
  participants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
}

const CompetitionsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const competitions: Competition[] = [
    {
      id: '1',
      title: 'Summer Basketball League',
      sport: 'Basketball',
      date: '2024-06-15',
      location: 'City Sports Center',
      participants: 24,
      status: 'upcoming',
    },
    // Add more sample competitions here
  ];

  const renderCompetition = ({ item }: { item: Competition }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleLarge">{item.title}</Text>
        <Text variant="bodyMedium">{item.sport}</Text>
        <View style={styles.details}>
          <Text variant="bodySmall">Date: {item.date}</Text>
          <Text variant="bodySmall">Location: {item.location}</Text>
          <Text variant="bodySmall">Participants: {item.participants}</Text>
        </View>
        <Chip
          mode="outlined"
          style={[
            styles.statusChip,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          {item.status}
        </Chip>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained">Register</Button>
        <Button mode="outlined">View Details</Button>
      </Card.Actions>
    </Card>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return '#E3F2FD';
      case 'ongoing':
        return '#E8F5E9';
      case 'completed':
        return '#F5F5F5';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search competitions"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
        <Chip
          selected={selectedFilter === 'upcoming'}
          onPress={() => setSelectedFilter('upcoming')}
          style={styles.filterChip}
        >
          Upcoming
        </Chip>
        <Chip
          selected={selectedFilter === 'ongoing'}
          onPress={() => setSelectedFilter('ongoing')}
          style={styles.filterChip}
        >
          Ongoing
        </Chip>
      </View>

      <FlatList
        data={competitions}
        renderItem={renderCompetition}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchBar: {
    margin: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  details: {
    marginVertical: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
});

export default CompetitionsScreen; 