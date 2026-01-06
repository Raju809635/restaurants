import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Heart,
  Star,
  IndianRupee,
  ShoppingCart,
  Truck,
} from 'lucide-react-native';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  brand: string;
  rating: number;
  reviews: number;
  images: string[];
  discount?: number;
  fastDelivery?: boolean;
  madeInIndia?: boolean;
  features: string[];
}

interface StoreItemCardProps {
  item: StoreItem;
  onPress: () => void;
  onAddToCart: () => void;
  onToggleFavorite: () => void;
  isFavorite?: boolean;
}

export default function StoreItemCard({ 
  item, 
  onPress, 
  onAddToCart, 
  onToggleFavorite,
  isFavorite = false 
}: StoreItemCardProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={onToggleFavorite}
        >
          <Heart 
            size={18} 
            color={isFavorite ? "#EF4444" : "#9CA3AF"} 
            fill={isFavorite ? "#EF4444" : "transparent"}
            strokeWidth={2} 
          />
        </TouchableOpacity>
        
        {item.discount && item.discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount}%</Text>
          </View>
        )}
        
        {item.fastDelivery && (
          <View style={styles.fastDeliveryBadge}>
            <Truck size={12} color="#FFFFFF" strokeWidth={2} />
          </View>
        )}
        
        {item.madeInIndia && (
          <View style={styles.madeInIndiaBadge}>
            <Text style={styles.madeInIndiaText}>🇮🇳</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.rating}>
          <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={2} />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewsText}>({item.reviews})</Text>
        </View>
        
        <View style={styles.features}>
          {item.features.slice(0, 2).map((feature, index) => (
            <View key={index} style={styles.featureTag}>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.pricing}>
            <View style={styles.priceRow}>
              <IndianRupee size={16} color="#111827" strokeWidth={2} />
              <Text style={styles.price}>{item.price.toLocaleString('hi-IN')}</Text>
            </View>
            {item.originalPrice && item.originalPrice > item.price && (
              <Text style={styles.originalPrice}>
                ₹{item.originalPrice.toLocaleString('hi-IN')}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={styles.addToCartButton}
            onPress={onAddToCart}
          >
            <ShoppingCart size={16} color="#FFFFFF" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 140,
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  fastDeliveryBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: '#10B981',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  madeInIndiaBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  madeInIndiaText: {
    fontSize: 10,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 18,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  reviewsText: {
    fontSize: 12,
    color: '#6B7280',
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 12,
  },
  featureTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featureText: {
    fontSize: 10,
    color: '#6B7280',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pricing: {
    flex: 1,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  originalPrice: {
    fontSize: 12,
    color: '#9CA3AF',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  addToCartButton: {
    backgroundColor: '#FF6B35',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});