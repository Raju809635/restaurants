import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Searchbar,
  Chip,
  Card,
  Avatar,
  Surface,
  IconButton,
} from 'react-native-paper';
import { sampleNews } from '../data/sampleData';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  sport?: string;
  image?: string;
  tags: string[];
  readTime: number;
}

const NewsScreen = ({ navigation }: { navigation: any }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const categories = ['All', 'Cricket', 'Football', 'Hockey', 'Kabaddi', 'Running', 'Basketball'];
  
  // Expanded sample news data
  const newsData: NewsArticle[] = [
    ...sampleNews,
    {
      id: '2',
      title: 'India Wins Cricket World Cup Semi-Final',
      summary: 'भारत ने क्रिकेट विश्व कप के सेमी-फाइनल में शानदार जीत दर्ज की - Dominant performance secures finals spot',
      content: 'Team India showcased exceptional batting and bowling skills...',
      author: 'Cricket Reporter',
      publishedAt: '2024-01-14T15:45:00Z',
      category: 'Cricket',
      sport: 'Cricket' as string,
      image: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['cricket', 'world-cup', 'india', 'semi-final'],
      readTime: 6
    },
    {
      id: '3',
      title: 'Pro Kabaddi League: New Season Begins',
      summary: 'नया प्रो कबड्डी लीग सीज़न शुरू - Eight teams compete for the championship title',
      content: 'The new season of Pro Kabaddi League kicks off with exciting matches...',
      author: 'Kabaddi Desk',
      publishedAt: '2024-01-13T12:30:00Z',
      category: 'Kabaddi',
      sport: 'Kabaddi' as string,
      image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['kabaddi', 'pro-kabaddi', 'league', 'championship'],
      readTime: 4
    },
    {
      id: '4',
      title: 'Mumbai Marathon Registration Open',
      summary: 'मुंबई मैराथन के लिए रजिस्ट्रेशन खुला - Early bird discounts available for participants',
      content: 'The annual Mumbai Marathon registration is now open...',
      author: 'Marathon Team',
      publishedAt: '2024-01-12T09:15:00Z',
      category: 'Running',
      sport: 'Running' as string,
      image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['marathon', 'mumbai', 'running', 'registration'],
      readTime: 3
    }
  ];

  const filteredNews = newsData.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.ceil(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const renderNewsCard = ({ item, index }: { item: NewsArticle, index: number }) => {
    const isFeature = index === 0;
    
    if (isFeature) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('NewsDetail', { article: item })}
          style={styles.featuredCard}
        >
          <Card style={styles.featuredCardContainer}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.featuredImage} />
            )}
            <Surface style={styles.featuredOverlay} elevation={0}>
              <View style={styles.featuredContent}>
                <Chip
                  style={styles.categoryChip}
                  textStyle={styles.categoryChipText}
                >
                  {item.category}
                </Chip>
                <Text variant="headlineSmall" style={styles.featuredTitle}>
                  {item.title}
                </Text>
                <Text variant="bodyMedium" style={styles.featuredSummary} numberOfLines={2}>
                  {item.summary}
                </Text>
                <View style={styles.featuredMeta}>
                  <Avatar.Text size={24} label={item.author.charAt(0)} style={styles.authorAvatar} />
                  <Text variant="bodySmall" style={styles.metaText}>
                    {item.author} • {formatDate(item.publishedAt)} • {item.readTime} min read
                  </Text>
                </View>
              </View>
            </Surface>
          </Card>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('NewsDetail', { article: item })}
        style={styles.newsCard}
      >
        <Card style={styles.newsCardContainer}>
          <Card.Content style={styles.newsContent}>
            <View style={styles.newsTextContainer}>
              <View style={styles.newsHeader}>
                <Chip
                  style={styles.smallCategoryChip}
                  textStyle={styles.smallCategoryChipText}
                >
                  {item.category}
                </Chip>
                <Text variant="bodySmall" style={styles.timeText}>
                  {formatDate(item.publishedAt)}
                </Text>
              </View>
              <Text variant="titleMedium" style={styles.newsTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text variant="bodyMedium" style={styles.newsSummary} numberOfLines={2}>
                {item.summary}
              </Text>
              <View style={styles.newsMeta}>
                <Text variant="bodySmall" style={styles.newsMetaText}>
                  {item.author} • {item.readTime} min read
                </Text>
                <View style={styles.newsActions}>
                  <IconButton icon="bookmark-outline" size={16} />
                  <IconButton icon="share-outline" size={16} />
                </View>
              </View>
            </View>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.newsImage} />
            )}
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text variant="headlineMedium" style={styles.headerTitle}>
        Sports News
      </Text>
      <Text variant="bodyMedium" style={styles.headerSubtitle}>
        खेल समाचार - Stay updated with latest sports news
      </Text>
      
      <Searchbar
        placeholder="Search news..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor="#FF6B35"
      />
      
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => (
            <Chip
              key={item}
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.filterChip,
                selectedCategory === item && styles.selectedFilterChip
              ]}
              textStyle={{
                color: selectedCategory === item ? '#FFFFFF' : '#FF6B35',
              }}
              selectedColor="#FF6B35"
            >
              {item}
            </Chip>
          )}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredNews}
        renderItem={renderNewsCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#FF6B35']}
            tintColor="#FF6B35"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 60,
    marginBottom: 16,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    color: '#6B7280',
    marginBottom: 20,
  },
  searchBar: {
    backgroundColor: '#F9FAFB',
    elevation: 0,
    marginBottom: 16,
  },
  categoriesContainer: {
    marginTop: 8,
  },
  filterContainer: {
    paddingRight: 20,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#F9FAFB',
  },
  selectedFilterChip: {
    backgroundColor: '#FF6B35',
  },
  featuredCard: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  featuredCardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  featuredImage: {
    width: '100%',
    height: 200,
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 16,
  },
  featuredContent: {
    flex: 1,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  featuredSummary: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    backgroundColor: '#FF6B35',
    marginRight: 8,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  categoryChip: {
    backgroundColor: '#FF6B35',
    alignSelf: 'flex-start',
  },
  categoryChipText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  newsCard: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  newsCardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
  },
  newsContent: {
    flexDirection: 'row',
    padding: 16,
  },
  newsTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  smallCategoryChip: {
    backgroundColor: '#FF6B3515',
    height: 24,
  },
  smallCategoryChipText: {
    color: '#FF6B35',
    fontSize: 10,
  },
  timeText: {
    color: '#6B7280',
  },
  newsTitle: {
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  newsSummary: {
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  newsMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsMetaText: {
    color: '#9CA3AF',
    flex: 1,
  },
  newsActions: {
    flexDirection: 'row',
  },
  newsImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});

export default NewsScreen;
