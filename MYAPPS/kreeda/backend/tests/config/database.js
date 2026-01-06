const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Event = require('../../models/Event');

class TestDatabase {
  constructor() {
    this.mongod = null;
    this.connection = null;
  }

  /**
   * Start in-memory MongoDB instance
   */
  async start() {
    this.mongod = await MongoMemoryServer.create({
      binary: {
        version: '6.0.0',
        downloadDir: './mongodb-binaries'
      },
      instance: {
        dbName: 'kreeda_test',
        port: 27018 // Different from default to avoid conflicts
      }
    });

    const uri = this.mongod.getUri();
    console.log(`Test MongoDB started at: ${uri}`);

    this.connection = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    return this.connection;
  }

  /**
   * Stop MongoDB instance and close connections
   */
  async stop() {
    if (this.connection) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
    
    if (this.mongod) {
      await this.mongod.stop();
    }
  }

  /**
   * Clear all test data from database
   */
  async clearAll() {
    const collections = mongoose.connection.collections;
    
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }

  /**
   * Seed database with test data
   */
  async seed() {
    await this.clearAll();
    
    // Create test users
    const testUsers = await this.seedUsers();
    
    // Create test events
    const testEvents = await this.seedEvents(testUsers);
    
    return {
      users: testUsers,
      events: testEvents
    };
  }

  /**
   * Seed test users
   */
  async seedUsers() {
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@test.com',
        password: 'password123',
        age: 25,
        gender: 'Male',
        location: 'Mumbai, India',
        sportsInterests: ['Cricket', 'Football'],
        level: 5,
        xp: 2500
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@test.com',
        password: 'password123',
        age: 28,
        gender: 'Female',
        location: 'Delhi, India',
        sportsInterests: ['Tennis', 'Badminton'],
        level: 7,
        xp: 4200
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@test.com',
        password: 'password123',
        age: 32,
        gender: 'Male',
        location: 'Bangalore, India',
        sportsInterests: ['Basketball', 'Volleyball'],
        level: 3,
        xp: 1800
      },
      {
        name: 'Sarah Wilson',
        email: 'sarah.wilson@test.com',
        password: 'password123',
        age: 24,
        gender: 'Female',
        location: 'Chennai, India',
        sportsInterests: ['Swimming', 'Hockey'],
        level: 6,
        xp: 3600
      },
      {
        name: 'Event Organizer',
        email: 'organizer@test.com',
        password: 'password123',
        age: 35,
        gender: 'Male',
        location: 'Mumbai, India',
        sportsInterests: ['Cricket', 'Football', 'Tennis'],
        level: 10,
        xp: 8500
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }

    console.log(`Seeded ${createdUsers.length} test users`);
    return createdUsers;
  }

  /**
   * Seed test events
   */
  async seedEvents(users) {
    const organizer = users[4]; // Event Organizer
    const participants = users.slice(0, 3);

    const eventsData = [
      {
        title: 'Weekly Cricket Match',
        description: 'Join us for a friendly cricket match every Sunday. All skill levels welcome!',
        sport: 'Cricket',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        startTime: '09:00',
        endTime: '13:00',
        location: {
          name: 'Oval Maidan',
          address: 'Oval Maidan, Fort, Mumbai, Maharashtra 400001',
          latitude: 18.9298,
          longitude: 72.8280
        },
        organizer: organizer._id,
        maxParticipants: 22,
        entryFee: 100,
        difficulty: 'Intermediate',
        requirements: ['Cricket whites', 'Own equipment'],
        prizes: ['Winning team trophy', 'Man of the match award'],
        isPublic: true,
        allowSpectators: true,
        provideEquipment: false,
        tags: ['weekly', 'friendly', 'cricket']
      },
      {
        title: 'Tennis Tournament - Singles',
        description: 'Competitive tennis tournament for advanced players. Prize money available!',
        sport: 'Tennis',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks
        startTime: '08:00',
        endTime: '18:00',
        location: {
          name: 'Mumbai Tennis Club',
          address: 'Tennis Club, Colaba, Mumbai, Maharashtra 400005',
          latitude: 18.9067,
          longitude: 72.8147
        },
        organizer: organizer._id,
        maxParticipants: 32,
        entryFee: 500,
        difficulty: 'Advanced',
        requirements: ['Advanced skill level', 'Own racket'],
        prizes: ['₹10,000 winner', '₹5,000 runner-up'],
        isPublic: true,
        allowSpectators: true,
        provideEquipment: false,
        tags: ['tournament', 'competitive', 'tennis']
      },
      {
        title: 'Beginner Football Training',
        description: 'Learn football basics with professional coach. Perfect for beginners!',
        sport: 'Football',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        startTime: '17:00',
        endTime: '19:00',
        location: {
          name: 'Cooperage Ground',
          address: 'Cooperage Ground, Colaba, Mumbai, Maharashtra 400001',
          latitude: 18.9220,
          longitude: 72.8347
        },
        organizer: organizer._id,
        maxParticipants: 20,
        entryFee: 0,
        difficulty: 'Beginner',
        requirements: ['Sports shoes', 'Water bottle'],
        prizes: ['Participation certificates'],
        isPublic: true,
        allowSpectators: true,
        provideEquipment: true,
        tags: ['training', 'beginner', 'football']
      },
      {
        title: 'Basketball 3v3 Championship',
        description: 'Fast-paced 3v3 basketball tournament. Form your team and compete!',
        sport: 'Basketball',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
        startTime: '15:00',
        endTime: '20:00',
        location: {
          name: 'Shivaji Park Basketball Court',
          address: 'Shivaji Park, Dadar, Mumbai, Maharashtra 400028',
          latitude: 19.0330,
          longitude: 72.8397
        },
        organizer: organizer._id,
        maxParticipants: 24,
        entryFee: 300,
        difficulty: 'Intermediate',
        requirements: ['Team of 3 players', 'Basketball shoes'],
        prizes: ['Trophy and medals', 'Basketball gear'],
        isPublic: true,
        allowSpectators: true,
        provideEquipment: false,
        tags: ['championship', '3v3', 'basketball']
      },
      {
        title: 'Swimming Workshop',
        description: 'Learn proper swimming techniques from certified instructor.',
        sport: 'Swimming',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
        startTime: '06:00',
        endTime: '08:00',
        location: {
          name: 'Olympic Swimming Pool',
          address: 'Swimming Pool, Kandivali, Mumbai, Maharashtra 400067',
          latitude: 19.2056,
          longitude: 72.8681
        },
        organizer: organizer._id,
        maxParticipants: 15,
        entryFee: 200,
        difficulty: 'Beginner',
        requirements: ['Swimming costume', 'Towel'],
        prizes: ['Swimming technique certificate'],
        isPublic: true,
        allowSpectators: false,
        provideEquipment: true,
        tags: ['workshop', 'swimming', 'beginner']
      }
    ];

    const createdEvents = [];
    for (const eventData of eventsData) {
      const event = new Event(eventData);
      
      // Register some participants for events
      if (createdEvents.length < 3) {
        event.participants = participants.slice(0, 2).map(p => p._id);
      }
      
      await event.save();
      createdEvents.push(event);
    }

    // Update user's registered events
    for (let i = 0; i < 2; i++) {
      participants[i].registeredEvents = createdEvents.slice(0, 3).map(e => e._id);
      await participants[i].save();
    }

    // Update organizer's organized events
    organizer.organizedEvents = createdEvents.map(e => e._id);
    await organizer.save();

    console.log(`Seeded ${createdEvents.length} test events`);
    return createdEvents;
  }

  /**
   * Get test data by type
   */
  async getTestData(type) {
    switch (type) {
      case 'users':
        return await User.find({});
      case 'events':
        return await Event.find({}).populate('organizer', 'name email');
      case 'organizer':
        return await User.findOne({ email: 'organizer@test.com' });
      case 'participants':
        return await User.find({ 
          email: { $in: ['john.doe@test.com', 'jane.smith@test.com', 'mike.johnson@test.com'] }
        });
      default:
        return null;
    }
  }

  /**
   * Create test data for specific scenarios
   */
  async createScenarioData(scenario) {
    switch (scenario) {
      case 'full_event':
        return await this.createFullEventScenario();
      case 'past_events':
        return await this.createPastEventsScenario();
      case 'private_events':
        return await this.createPrivateEventsScenario();
      default:
        return null;
    }
  }

  async createFullEventScenario() {
    const organizer = await User.findOne({ email: 'organizer@test.com' });
    const participants = await User.find({ 
      email: { $ne: 'organizer@test.com' }
    }).limit(2);

    const fullEvent = new Event({
      title: 'Full Event Test',
      description: 'This event is at capacity',
      sport: 'Tennis',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: '10:00',
      endTime: '12:00',
      location: {
        name: 'Test Court',
        address: 'Test Address, Mumbai',
        latitude: 19.0760,
        longitude: 72.8777
      },
      organizer: organizer._id,
      maxParticipants: 2,
      participants: participants.map(p => p._id),
      entryFee: 0,
      difficulty: 'Beginner',
      isPublic: true
    });

    await fullEvent.save();
    return fullEvent;
  }

  async createPastEventsScenario() {
    const organizer = await User.findOne({ email: 'organizer@test.com' });

    const pastEvents = [
      {
        title: 'Past Cricket Match',
        sport: 'Cricket',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        status: 'completed'
      },
      {
        title: 'Past Tennis Match',
        sport: 'Tennis', 
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: 'completed'
      }
    ];

    const createdPastEvents = [];
    for (const eventData of pastEvents) {
      const event = new Event({
        ...eventData,
        description: 'Past event for testing',
        startTime: '10:00',
        endTime: '12:00',
        location: {
          name: 'Test Ground',
          address: 'Test Address, Mumbai',
          latitude: 19.0760,
          longitude: 72.8777
        },
        organizer: organizer._id,
        maxParticipants: 10,
        entryFee: 0,
        difficulty: 'Beginner',
        isPublic: true
      });

      await event.save();
      createdPastEvents.push(event);
    }

    return createdPastEvents;
  }

  async createPrivateEventsScenario() {
    const organizer = await User.findOne({ email: 'organizer@test.com' });

    const privateEvent = new Event({
      title: 'Private Event Test',
      description: 'This is a private event',
      sport: 'Football',
      date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      startTime: '14:00',
      endTime: '16:00',
      location: {
        name: 'Private Ground',
        address: 'Private Address, Mumbai',
        latitude: 19.0760,
        longitude: 72.8777
      },
      organizer: organizer._id,
      maxParticipants: 10,
      entryFee: 0,
      difficulty: 'Intermediate',
      isPublic: false
    });

    await privateEvent.save();
    return privateEvent;
  }
}

module.exports = TestDatabase;
