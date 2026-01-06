import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  IndianRupee,
  Star,
  Flag,
} from 'lucide-react-native';

interface Event {
  id: string;
  title: string;
  description: string;
  sport: string;
  date: string;
  startTime: string;
  endTime: string;
  location: {
    name: string;
    address: string;
  };
  organizer: string;
  maxParticipants: number;
  currentParticipants: number;
  entryFee?: number;
  image?: string;
  rating: number;
  difficulty: string;
  category: string;
  city: string;
  state: string;
}

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onJoin: () => void;
}

export default function EventCard({ event, onPress, onJoin }: EventCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return '#10B981';
      case 'Intermediate':
        return '#F59E0B';
      case 'Advanced':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const progressPercentage = (event.currentParticipants / event.maxParticipants) * 100;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{event.title}</Text>
            <View style={styles.locationBadge}>
              <Flag size={12} color="#FF6B35" strokeWidth={2} />
              <Text style={styles.locationText}>{event.state}</Text>
            </View>
          </View>
          <View style={styles.labels}>
            <View style={[
              styles.difficultyLabel, 
              { backgroundColor: getDifficultyColor(event.difficulty) + '15' }
            ]}>
              <Text style={[
                styles.difficultyText, 
                { color: getDifficultyColor(event.difficulty) }
              ]}>
                {event.difficulty}
              </Text>
            </View>
            <View style={styles.categoryLabel}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Calendar size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText}>
              {new Date(event.date).toLocaleDateString('hi-IN', { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric' 
              })}
            </Text>
            <Clock size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText}>
              {event.startTime} - {event.endTime}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText} numberOfLines={1}>
              {event.location.name}, {event.city}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Users size={16} color="#6B7280" strokeWidth={2} />
            <Text style={styles.detailText}>
              {event.currentParticipants.toLocaleString('hi-IN')}/{event.maxParticipants.toLocaleString('hi-IN')} प्रतिभागी
            </Text>
            {event.entryFee && (
              <>
                <IndianRupee size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.detailText}>₹{event.entryFee.toLocaleString('hi-IN')}</Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.participantProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(progressPercentage)}% भरा हुआ
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={onJoin}
          >
            <Text style={styles.joinButtonText}>Join Event</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rating}>
          <Star size={14} color="#FFD700" fill="#FFD700" strokeWidth={2} />
          <Text style={styles.ratingText}>{event.rating}</Text>
          <Text style={styles.organizerText}>by {event.organizer}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF4F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  labels: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyLabel: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryLabel: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#138808',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  details: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  participantProgress: {
    flex: 1,
    marginRight: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF6B35',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  joinButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  organizerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
  },
});