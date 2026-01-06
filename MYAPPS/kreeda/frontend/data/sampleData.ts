import { Sport, Event, StoreItem, NewsArticle, Stadium } from '@/types';

export const sampleSports: Sport[] = [
  {
    id: '1',
    name: 'Cricket',
    category: 'Popular',
    description: 'भारत का सबसे लोकप्रिय खेल - The gentleman\'s game played with passion across India',
    image: 'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800',
    rules: [
      'Two teams of 11 players each',
      'Match formats: Test, ODI, T20',
      'Batting and bowling alternates between teams',
      'Runs scored by hitting the ball and running between wickets'
    ],
    equipment: [
      'Cricket bat (बल्ला)',
      'Cricket ball (गेंद)',
      'Wickets (विकेट)',
      'Pads (पैड)',
      'Gloves (दस्ताने)',
      'Helmet (हेलमेट)'
    ],
    olympicStatus: 'none',
    history: 'Cricket was introduced to India by British colonizers in the 18th century and became the most beloved sport...',
    popularCountries: ['India', 'Australia', 'England', 'Pakistan', 'South Africa'],
    stats: {
      totalAthletes: 100000000,
      worldRecord: 'Highest ODI Score: 498/4 (England vs Netherlands)',
      olympicRecords: []
    }
  },
  {
    id: '2',
    name: 'Kabaddi',
    category: 'Traditional',
    description: 'कबड्डी - Ancient Indian contact sport requiring strength, strategy and breath control',
    image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=800',
    rules: [
      'Two teams of 7 players each',
      'Raider must tag opponents and return to own half',
      'Must chant "kabaddi" continuously while raiding',
      'Defenders try to tackle the raider'
    ],
    equipment: [
      'Kabaddi mat (कबड्डी मैट)',
      'Sports shoes',
      'Comfortable clothing',
      'Knee pads (optional)'
    ],
    olympicStatus: 'none',
    history: 'Kabaddi originated in ancient India and has been played for over 4000 years...',
    popularCountries: ['India', 'Iran', 'South Korea', 'Japan', 'Bangladesh'],
    stats: {
      totalAthletes: 50000000,
      worldRecord: 'Pro Kabaddi League highest raid points in a season',
      olympicRecords: []
    }
  }
];

export const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Mumbai Marathon 2024',
    description: 'मुंबई की सबसे बड़ी मैराथन - Annual marathon through Mumbai\'s iconic locations',
    sport: 'Running',
    date: '2024-02-18',
    startTime: '06:00',
    endTime: '12:00',
    location: {
      name: 'Marine Drive, Mumbai',
      address: 'Marine Drive, Nariman Point, Mumbai, Maharashtra 400021',
      latitude: 18.9220,
      longitude: 72.8347
    },
    organizer: 'Mumbai Runners Club',
    maxParticipants: 45000,
    currentParticipants: 38500,
    entryFee: 1500,
    requirements: [
      'Medical certificate required',
      'Age 18+ years',
      'Previous running experience recommended'
    ],
    prizes: [
      'Gold medal + ₹50,000 (1st place)',
      'Silver medal + ₹25,000 (2nd place)',
      'Bronze medal + ₹15,000 (3rd place)',
      'Finisher medals for all participants'
    ],
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'upcoming',
    participants: []
  }
];

export const sampleStoreItems: StoreItem[] = [
  {
    id: '1',
    name: 'Professional Cricket Bat',
    description: 'प्रीमियम विलो क्रिकेट बैट - Professional grade cricket bat used by Indian cricket stars',
    price: 8999,
    category: 'equipment',
    sport: 'Cricket',
    images: [
      'https://images.pexels.com/photos/163452/basketball-dunk-blue-game-163452.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    brand: 'MRF',
    rating: 4.8,
    reviews: 324,
    inStock: true,
    specifications: {
      'Weight': '1.2 kg',
      'Wood': 'English Willow',
      'Handle': 'Cane Handle',
      'Size': 'Short Handle'
    }
  }
];

export const sampleNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Indian Hockey Team Wins Asian Champions Trophy',
    summary: 'भारतीय हॉकी टीम ने एशियाई चैंपियंस ट्रॉफी जीती - Historic victory against Malaysia in the final',
    content: 'The Indian hockey team created history by winning the Asian Champions Trophy...',
    author: 'Sports India Reporter',
    publishedAt: '2024-01-15T10:30:00Z',
    category: 'Hockey',
    sport: 'Hockey',
    image: 'https://images.pexels.com/photos/2402777/pexels-photo-2402777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['hockey', 'asian-champions-trophy', 'india', 'victory'],
    readTime: 4
  }
];

export const sampleStadiums: Stadium[] = [
  {
    id: '1',
    name: 'Wankhede Stadium',
    address: 'D Road, Churchgate, Mumbai, Maharashtra 400020',
    latitude: 18.9389,
    longitude: 72.8258,
    sports: ['Cricket'],
    capacity: 33108,
    facilities: [
      'Cricket Ground',
      'VIP Boxes',
      'Media Center',
      'Player Facilities',
      'Parking',
      'Food Courts'
    ],
    rating: 4.7,
    image: 'https://images.pexels.com/photos/270640/pexels-photo-270640.jpeg?auto=compress&cs=tinysrgb&w=800',
    contact: {
      phone: '+91-22-2281-1234',
      email: 'info@wankhede.com',
      website: 'https://wankhedestadium.com'
    }
  },
  {
    id: '2',
    name: 'Jawaharlal Nehru Stadium',
    address: 'Lodhi Road, New Delhi, Delhi 110003',
    latitude: 28.5833,
    longitude: 77.2333,
    sports: ['Football', 'Athletics', 'Hockey'],
    capacity: 60000,
    facilities: [
      'Athletics Track',
      'Football Field',
      'Hockey Ground',
      'Training Facilities',
      'Medical Center',
      'Parking'
    ],
    rating: 4.5,
    image: 'https://images.pexels.com/photos/270640/pexels-photo-270640.jpeg?auto=compress&cs=tinysrgb&w=800',
    contact: {
      phone: '+91-11-2436-1234',
      email: 'info@jnstadium.gov.in',
      website: 'https://jnstadium.gov.in'
    }
  }
];