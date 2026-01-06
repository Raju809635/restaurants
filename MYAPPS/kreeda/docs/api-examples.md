# Krida API Testing Examples

This document provides practical examples and test cases for the Krida API endpoints.

## Prerequisites

- Base URL: `http://localhost:4000/api`
- Authentication: JWT token required for protected endpoints
- Content-Type: `application/json` for POST/PUT requests

## Quick Start Testing Sequence

### 1. User Registration and Authentication

```bash
# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# Expected Response:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#     "user": {
#       "id": "64a7b8c9d1e2f3a4b5c6d7e8",
#       "name": "Test User",
#       "email": "test@example.com"
#     }
#   },
#   "message": "User registered successfully"
# }
```

```bash
# Login user
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Save the token from response for subsequent requests
export JWT_TOKEN="your_jwt_token_here"
```

### 2. Profile Management

```bash
# Get user profile
curl -X GET http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer $JWT_TOKEN"

# Update user profile
curl -X PUT http://localhost:4000/api/users/profile \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Test User",
    "profile": {
      "age": 28,
      "sports": ["Cricket", "Football"],
      "location": "Mumbai, Maharashtra",
      "bio": "Sports enthusiast and community organizer",
      "phone": "+91 9876543210",
      "skillLevels": {
        "Cricket": "Advanced",
        "Football": "Intermediate"
      },
      "preferences": {
        "notifications": true,
        "publicProfile": true,
        "shareLocation": false
      }
    }
  }'
```

### 3. Event Management

```bash
# Create a new event
curl -X POST http://localhost:4000/api/events \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Sunday Cricket Match",
    "description": "Friendly cricket match for local players. All skill levels welcome!",
    "sport": "Cricket",
    "date": "2024-02-25",
    "startTime": "09:00",
    "endTime": "15:00",
    "location": {
      "name": "Central Park Ground",
      "address": "Central Park, Mumbai, Maharashtra 400001",
      "latitude": 19.0760,
      "longitude": 72.8777
    },
    "maxParticipants": 22,
    "entryFee": 100,
    "difficulty": "Beginner",
    "requirements": ["Age 16+ years", "Bring your own equipment"],
    "prizes": ["Trophy for winning team", "Medals for all participants"],
    "isPublic": true,
    "allowSpectators": true,
    "provideEquipment": false
  }'

# Get all events with filters
curl -X GET "http://localhost:4000/api/events?sport=Cricket&city=Mumbai&status=upcoming&limit=5" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Register for an event (use event ID from previous response)
curl -X POST http://localhost:4000/api/events/EVENT_ID_HERE/register \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## JavaScript/Node.js Examples

### Using Axios

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:4000/api';
let authToken = null;

// Helper function to set authorization header
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(authToken && { 'Authorization': `Bearer ${authToken}` })
});

// Register and login
async function registerUser() {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, {
      name: 'JavaScript User',
      email: 'jsuser@example.com',
      password: 'password123'
    });
    
    authToken = response.data.data.token;
    console.log('User registered and token saved:', authToken);
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response.data);
  }
}

// Create an event
async function createEvent() {
  try {
    const response = await axios.post(`${API_BASE}/events`, {
      title: 'JavaScript Test Event',
      description: 'Event created via JavaScript API test',
      sport: 'Football',
      date: '2024-03-01',
      startTime: '10:00',
      endTime: '12:00',
      location: {
        name: 'Test Ground',
        address: 'Test Address, Mumbai',
        latitude: 19.0760,
        longitude: 72.8777
      },
      maxParticipants: 20,
      entryFee: 0,
      difficulty: 'Beginner',
      isPublic: true,
      allowSpectators: true,
      provideEquipment: false
    }, { headers: getHeaders() });
    
    console.log('Event created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Event creation failed:', error.response.data);
  }
}

// Get user statistics
async function getUserStats() {
  try {
    const response = await axios.get(`${API_BASE}/users/stats`, {
      headers: getHeaders()
    });
    
    console.log('User stats:', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed to get user stats:', error.response.data);
  }
}

// Run tests
async function runTests() {
  await registerUser();
  await createEvent();
  await getUserStats();
}

runTests();
```

### Using Fetch API (Browser/Node.js 18+)

```javascript
class KridaAPI {
  constructor(baseURL = 'http://localhost:4000/api') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    return response.json();
  }

  async register(name, email, password) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });
    
    this.token = response.data.token;
    return response;
  }

  async login(email, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    this.token = response.data.token;
    return response;
  }

  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  }

  async getEvents(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/events?${params}`);
  }

  async createEvent(eventData) {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(eventData)
    });
  }

  async registerForEvent(eventId) {
    return this.request(`/events/${eventId}/register`, {
      method: 'POST'
    });
  }
}

// Usage example
async function testAPI() {
  const api = new KridaAPI();

  try {
    // Register user
    await api.register('Fetch User', 'fetchuser@example.com', 'password123');
    console.log('User registered successfully');

    // Get profile
    const profile = await api.getProfile();
    console.log('User profile:', profile);

    // Create event
    const newEvent = await api.createEvent({
      title: 'Fetch API Test Event',
      description: 'Testing event creation with Fetch API',
      sport: 'Tennis',
      date: '2024-03-05',
      startTime: '16:00',
      endTime: '18:00',
      location: {
        name: 'Tennis Court',
        address: 'Sports Complex, Mumbai'
      },
      maxParticipants: 4,
      entryFee: 200,
      difficulty: 'Intermediate',
      isPublic: true,
      allowSpectators: false,
      provideEquipment: true
    });
    console.log('Event created:', newEvent);

  } catch (error) {
    console.error('API test failed:', error.message);
  }
}

testAPI();
```

## Python Examples

### Using Requests Library

```python
import requests
import json

class KridaAPI:
    def __init__(self, base_url='http://localhost:4000/api'):
        self.base_url = base_url
        self.token = None
        self.session = requests.Session()
        
    def _get_headers(self):
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers
    
    def register(self, name, email, password):
        response = self.session.post(
            f'{self.base_url}/auth/register',
            json={'name': name, 'email': email, 'password': password},
            headers=self._get_headers()
        )
        if response.status_code == 201:
            data = response.json()
            self.token = data['data']['token']
            return data
        else:
            raise Exception(f'Registration failed: {response.text}')
    
    def login(self, email, password):
        response = self.session.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password},
            headers=self._get_headers()
        )
        if response.status_code == 200:
            data = response.json()
            self.token = data['data']['token']
            return data
        else:
            raise Exception(f'Login failed: {response.text}')
    
    def get_profile(self):
        response = self.session.get(
            f'{self.base_url}/users/profile',
            headers=self._get_headers()
        )
        return response.json() if response.status_code == 200 else None
    
    def create_event(self, event_data):
        response = self.session.post(
            f'{self.base_url}/events',
            json=event_data,
            headers=self._get_headers()
        )
        return response.json() if response.status_code == 201 else None
    
    def get_events(self, **filters):
        response = self.session.get(
            f'{self.base_url}/events',
            params=filters,
            headers=self._get_headers()
        )
        return response.json() if response.status_code == 200 else None

# Usage example
def test_api():
    api = KridaAPI()
    
    try:
        # Register user
        user_data = api.register('Python User', 'pythonuser@example.com', 'password123')
        print('User registered:', user_data['data']['user']['name'])
        
        # Get profile
        profile = api.get_profile()
        print('Profile retrieved for:', profile['data']['name'])
        
        # Create event
        event = api.create_event({
            'title': 'Python API Test Event',
            'description': 'Event created using Python requests',
            'sport': 'Badminton',
            'date': '2024-03-10',
            'startTime': '18:00',
            'endTime': '20:00',
            'location': {
                'name': 'Badminton Hall',
                'address': 'Sports Center, Mumbai'
            },
            'maxParticipants': 8,
            'entryFee': 150,
            'difficulty': 'Intermediate',
            'isPublic': True,
            'allowSpectators': True,
            'provideEquipment': True
        })
        print('Event created:', event['data']['title'])
        
        # Get events with filter
        events = api.get_events(sport='Badminton', status='upcoming')
        print(f'Found {len(events["data"]["events"])} badminton events')
        
    except Exception as e:
        print(f'Error: {e}')

if __name__ == '__main__':
    test_api()
```

## Postman Collection JSON

Save this as `krida-api.postman_collection.json` for importing into Postman:

```json
{
  "info": {
    "name": "Krida Sports API",
    "description": "Complete API collection for Krida sports application",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:4000/api",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('authToken', response.data.token);",
                  "}"
                ]
              }
            }
          ]
        },
        {
          "name": "Login User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const response = pm.response.json();",
                  "    pm.environment.set('authToken', response.data.token);",
                  "}"
                ]
              }
            }
          ]
        }
      ]
    },
    {
      "name": "User Management",
      "item": [
        {
          "name": "Get User Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["users", "profile"]
            }
          }
        },
        {
          "name": "Update User Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Updated User\",\n  \"profile\": {\n    \"age\": 28,\n    \"sports\": [\"Cricket\", \"Football\"],\n    \"location\": \"Mumbai, Maharashtra\",\n    \"bio\": \"Updated bio\"\n  }\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/users/profile",
              "host": ["{{baseUrl}}"],
              "path": ["users", "profile"]
            }
          }
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Get All Events",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{baseUrl}}/events?limit=10&page=1",
              "host": ["{{baseUrl}}"],
              "path": ["events"],
              "query": [
                {
                  "key": "limit",
                  "value": "10"
                },
                {
                  "key": "page",
                  "value": "1"
                }
              ]
            }
          }
        },
        {
          "name": "Create Event",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{authToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Test Cricket Match\",\n  \"description\": \"Friendly cricket match for testing\",\n  \"sport\": \"Cricket\",\n  \"date\": \"2024-03-01\",\n  \"startTime\": \"09:00\",\n  \"endTime\": \"15:00\",\n  \"location\": {\n    \"name\": \"Test Ground\",\n    \"address\": \"Test Address, Mumbai\"\n  },\n  \"maxParticipants\": 22,\n  \"entryFee\": 100,\n  \"difficulty\": \"Beginner\",\n  \"isPublic\": true,\n  \"allowSpectators\": true,\n  \"provideEquipment\": false\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/events",
              "host": ["{{baseUrl}}"],
              "path": ["events"]
            }
          }
        }
      ]
    }
  ]
}
```

## Testing Checklist

### Authentication Tests
- [ ] User registration with valid data
- [ ] User registration with duplicate email (should fail)
- [ ] User login with valid credentials
- [ ] User login with invalid credentials (should fail)
- [ ] Access protected endpoint without token (should fail)
- [ ] Access protected endpoint with invalid token (should fail)

### User Management Tests
- [ ] Get user profile with valid token
- [ ] Update user profile with valid data
- [ ] Update user profile with invalid data (validation tests)

### Event Management Tests
- [ ] Create event with valid data
- [ ] Create event with invalid data (validation tests)
- [ ] Get all events (public access)
- [ ] Get events with various filters
- [ ] Register for event
- [ ] Attempt to register for same event twice (should handle gracefully)
- [ ] Unregister from event

### Error Handling Tests
- [ ] Test all documented error responses
- [ ] Verify proper HTTP status codes
- [ ] Confirm error message formats

## Performance Testing

Use tools like Apache Bench (ab) or Artillery.js for load testing:

```bash
# Test event listing endpoint
ab -n 1000 -c 10 http://localhost:4000/api/events

# Test with authentication (save token to file first)
ab -n 100 -c 5 -H "Authorization: Bearer YOUR_TOKEN" http://localhost:4000/api/users/profile
```

This comprehensive testing guide should help you validate all aspects of the Krida API functionality.
