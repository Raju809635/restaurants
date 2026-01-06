import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  Filter,
  ShoppingCart,
  Truck,
  Shield,
  Award,
  MapPin,
} from 'lucide-react-native';
import StoreItemCard from '@/components/StoreItemCard';

const { width } = Dimensions.get('window');

export default function StoreScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', 'Cricket', 'Kabaddi', 'Badminton', 'Hockey', 'Traditional', 'Nutrition'];

  const storeItems = [
    {
      id: '1',
      name: 'Professional Cricket Bat',
      description: 'प्रीमियम विलो क्रिकेट बैट - Used by Indian cricket stars',
      price: 8999,
      originalPrice: 12999,
      category: 'Cricket',
      sport: 'Cricket',
      images: ['https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'MRF',
      rating: 4.8,
      reviews: 324,
      discount: 31,
      features: ['Professional Grade', 'Hand Crafted', 'ISI Certified'],
      fastDelivery: true,
      madeInIndia: true,
    },
    {
      id: '2',
      name: 'Kabaddi Mat Professional',
      description: 'प्रोफेशनल कबड्डी मैट - Official tournament quality',
      price: 15999,
      originalPrice: 19999,
      category: 'Kabaddi',
      sport: 'Kabaddi',
      images: ['https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'Nivia',
      rating: 4.7,
      reviews: 89,
      discount: 20,
      features: ['Tournament Grade', 'Anti-Slip', 'Easy to Clean'],
      fastDelivery: false,
      madeInIndia: true,
    },
    {
      id: '3',
      name: 'Badminton Racket Pro',
      description: 'बैडमिंटन रैकेट - P.V. Sindhu signature series',
      price: 4599,
      originalPrice: 5999,
      category: 'Badminton',
      sport: 'Badminton',
      images: ['https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'Yonex',
      rating: 4.9,
      reviews: 267,
      discount: 23,
      features: ['Carbon Fiber', 'Signature Series', 'Professional'],
      fastDelivery: true,
      madeInIndia: false,
    },
    {
      id: '4',
      name: 'Hockey Stick Indian',
      description: 'हॉकी स्टिक - National team approved design',
      price: 2999,
      originalPrice: 3999,
      category: 'Hockey',
      sport: 'Hockey',
      images: ['https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'Adidas',
      rating: 4.6,
      reviews: 156,
      discount: 25,
      features: ['National Team Grade', 'Lightweight', 'Durable'],
      fastDelivery: true,
      madeInIndia: true,
    },
    {
      id: '5',
      name: 'Traditional Kushti Langot',
      description: 'पारंपरिक कुश्ती लंगोट - Authentic wrestling gear',
      price: 899,
      originalPrice: 1299,
      category: 'Traditional',
      sport: 'Wrestling',
      images: ['https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'Bharatiya Kushti',
      rating: 4.5,
      reviews: 78,
      discount: 31,
      features: ['Handwoven', 'Traditional', 'Comfortable'],
      fastDelivery: false,
      madeInIndia: true,
    },
    {
      id: '6',
      name: 'Ayurvedic Sports Protein',
      description: 'आयुर्वेदिक स्पोर्ट्स प्रोटीन - Natural muscle building',
      price: 2499,
      originalPrice: 2999,
      category: 'Nutrition',
      sport: 'Fitness',
      images: ['https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800'],
      brand: 'Patanjali Nutrela',
      rating: 4.4,
      reviews: 203,
      discount: 17,
      features: ['100% Natural', 'Ayurvedic', 'No Side Effects'],
      fastDelivery: true,
      madeInIndia: true,
    },
  ];

  const filteredItems = storeItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.includes(searchQuery);
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredDeals = storeItems.filter(item => item.discount && item.discount >= 25).slice(0, 3);

  const handleAddToCart = (itemId: string) => {
    setCartItems(prev => prev + 1);
    Alert.alert(
      'Added to Cart',
      'Item has been added to your cart successfully!',
      [{ text: 'OK' }]
    );
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  const handleItemPress = (item: any) => {
    Alert.alert(
      item.name,
      `${item.description}\n\nBrand: ${item.brand}\nPrice: ₹${item.price.toLocaleString('hi-IN')}\nRating: ${item.rating}/5 (${item.reviews} reviews)\n\nFeatures:\n${item.features.join('\n')}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Add to Cart', onPress: () => handleAddToCart(item.id) },
      ]
    );
  };

  const handleFilter = () => {
    Alert.alert(
      'Filter Products',
      'Filter options:\n• By Price Range\n• By Brand\n• By Rating\n• By Delivery Options\n• Made in India Only',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>भारतीय खेल स्टोर</Text>
              <Text style={styles.headerSubtitle}>Indian Sports Store</Text>
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <ShoppingCart size={24} color="#374151" strokeWidth={2} />
              {cartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.searchContainer}>
            <Search size={20} color="#6B7280" strokeWidth={2} />
            <TextInput
              style={styles.searchInput}
              placeholder="उत्पाद खोजें / Search products..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
            <TouchableOpacity style={styles.filterButton} onPress={handleFilter}>
              <Filter size={20} color="#6B7280" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Truck size={20} color="#10B981" strokeWidth={2} />
            <Text style={styles.benefitText}>Free Delivery</Text>
          </View>
          <View style={styles.benefitItem}>
            <Shield size={20} color="#FF6B35" strokeWidth={2} />
            <Text style={styles.benefitText}>Warranty</Text>
          </View>
          <View style={styles.benefitItem}>
            <Award size={20} color="#138808" strokeWidth={2} />
            <Text style={styles.benefitText}>Quality Assured</Text>
          </View>
          <View style={styles.benefitItem}>
            <MapPin size={20} color="#000080" strokeWidth={2} />
            <Text style={styles.benefitText}>Made in India</Text>
          </View>
        </View>

        {featuredDeals.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>आज के ऑफर्स (Today's Deals)</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.dealsContainer}>
                {featuredDeals.map((item) => (
                  <View key={item.id} style={styles.dealCardContainer}>
                    <StoreItemCard
                      item={item}
                      onPress={() => handleItemPress(item)}
                      onAddToCart={() => handleAddToCart(item.id)}
                      onToggleFavorite={() => handleToggleFavorite(item.id)}
                      isFavorite={favorites.includes(item.id)}
                    />
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

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
          <Text style={styles.sectionTitle}>सभी उत्पाद (All Products)</Text>
          <View style={styles.productsGrid}>
            {filteredItems.map((item) => (
              <View key={item.id} style={styles.productCardContainer}>
                <StoreItemCard
                  item={item}
                  onPress={() => handleItemPress(item)}
                  onAddToCart={() => handleAddToCart(item.id)}
                  onToggleFavorite={() => handleToggleFavorite(item.id)}
                  isFavorite={favorites.includes(item.id)}
                />
              </View>
            ))}
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
  cartButton: {
    position: 'relative',
    padding: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
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
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  benefitItem: {
    alignItems: 'center',
    gap: 6,
  },
  benefitText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
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
  dealsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  dealCardContainer: {
    width: 200,
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
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  productCardContainer: {
    width: (width - 56) / 2,
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