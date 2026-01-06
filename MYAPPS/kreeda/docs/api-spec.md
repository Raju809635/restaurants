# Krida API Specification

This document describes the comprehensive API endpoints for the Krida sports application backend.

## Base URL

```
http://localhost:4000/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Response Format

All API responses follow a consistent JSON format:

### Success Response
```json
{
  "success": true,
  "data": {}, // Response data
  "message": "Success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message"
  }
}
```

## HTTP Status Codes

- `200` - OK: The request was successful
- `201` - Created: Resource was created successfully
- `400` - Bad Request: Invalid request data
- `401` - Unauthorized: Authentication required
- `403` - Forbidden: Access denied
- `404` - Not Found: Resource not found
- `422` - Unprocessable Entity: Validation errors
- `500` - Internal Server Error: Server error

---

# Authentication Endpoints

## Register User

Create a new user account.

**Endpoint:** `POST /auth/register`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "Arjun Sharma",
      "email": "arjun@example.com"
    }
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format, unique
- `password`: Required, minimum 6 characters

**Error Responses:**
- `400`: User already exists
- `422`: Validation errors

---

## Login User

Authenticate user and get access token.

**Endpoint:** `POST /auth/login`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "arjun@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a7b8c9d1e2f3a4b5c6d7e8",
      "name": "Arjun Sharma",
      "email": "arjun@example.com"
    }
  },
  "message": "Login successful"
}
```

**Error Responses:**
- `400`: Invalid credentials
- `422`: Validation errors

---

# User Management Endpoints

## Get User Profile

Get the authenticated user's profile information.

**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "name": "Arjun Sharma",
    "email": "arjun@example.com",
    "profile": {
      "age": 28,
      "sports": ["Cricket", "Football", "Running"],
      "location": "Mumbai, Maharashtra",
      "bio": "Passionate cricket player and sports enthusiast",
      "avatar": "https://example.com/avatar.jpg",
      "achievements": ["First Marathon", "Cricket Champion"]
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-16T12:45:00.000Z"
  }
}
```

**Error Responses:**
- `401`: Unauthorized
- `404`: User not found

---

## Update User Profile

Update the authenticated user's profile information.

**Endpoint:** `PUT /users/profile`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Arjun Kumar Sharma",
  "profile": {
    "age": 29,
    "sports": ["Cricket", "Football", "Running", "Kabaddi"],
    "location": "Mumbai, Maharashtra",
    "bio": "Passionate sports player and community organizer",
    "avatar": "https://example.com/new-avatar.jpg",
    "phone": "+91 9876543210",
    "skillLevels": {
      "Cricket": "Advanced",
      "Football": "Intermediate",
      "Running": "Expert"
    },
    "preferences": {
      "notifications": true,
      "publicProfile": true,
      "shareLocation": false
    }
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "name": "Arjun Kumar Sharma",
    "email": "arjun@example.com",
    "profile": {
      // Updated profile data
    }
  },
  "message": "Profile updated successfully"
}
```

---

## Get User Statistics

Get user's sports statistics and achievements.

**Endpoint:** `GET /users/stats`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalEvents": 45,
    "completedEvents": 38,
    "upcomingEvents": 7,
    "eventsCreated": 12,
    "totalXP": 2450,
    "level": 15,
    "achievements": [
      {
        "id": "achievement_1",
        "title": "Marathon Master",
        "description": "Complete your first marathon",
        "unlockedAt": "2024-01-10T08:30:00.000Z",
        "xpReward": 200,
        "rarity": "rare"
      }
    ],
    "friendsCount": 24,
    "winRate": 72.5,
    "distanceCovered": 485,
    "hoursPlayed": 156
  }
}
```

---

# Events Management Endpoints

## Get All Events

Retrieve a list of all sports events with optional filtering.

**Endpoint:** `GET /events`

**Query Parameters:**
- `sport` (optional): Filter by sport type
- `city` (optional): Filter by city
- `date` (optional): Filter by date (YYYY-MM-DD)
- `status` (optional): Filter by status (upcoming, ongoing, completed)
- `limit` (optional): Number of events per page (default: 20)
- `page` (optional): Page number (default: 1)
- `search` (optional): Search in title and description

**Example:** `GET /events?sport=Cricket&city=Mumbai&status=upcoming&limit=10&page=1`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      {
        "id": "64a7b8c9d1e2f3a4b5c6d7e8",
        "title": "Mumbai Marathon 2024",
        "description": "Annual marathon through Mumbai's iconic locations",
        "sport": "Running",
        "date": "2024-02-18",
        "startTime": "06:00",
        "endTime": "12:00",
        "location": {
          "name": "Marine Drive, Mumbai",
          "address": "Marine Drive, Nariman Point, Mumbai, Maharashtra 400021",
          "latitude": 18.9220,
          "longitude": 72.8347
        },
        "organizer": "Mumbai Runners Club",
        "createdBy": "64a7b8c9d1e2f3a4b5c6d7e9",
        "maxParticipants": 45000,
        "currentParticipants": 38500,
        "entryFee": 1500,
        "difficulty": "Intermediate",
        "status": "upcoming",
        "requirements": [
          "Medical certificate required",
          "Age 18+ years",
          "Previous running experience recommended"
        ],
        "prizes": [
          "Gold medal + ₹50,000 (1st place)",
          "Silver medal + ₹25,000 (2nd place)",
          "Bronze medal + ₹15,000 (3rd place)"
        ],
        "image": "https://example.com/marathon-image.jpg",
        "isPublic": true,
        "allowSpectators": true,
        "provideEquipment": false,
        "createdAt": "2024-01-01T10:30:00.000Z",
        "updatedAt": "2024-01-15T14:20:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalEvents": 47,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

---

## Get Single Event

Get detailed information about a specific event.

**Endpoint:** `GET /events/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Single event object with full details
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    "title": "Mumbai Marathon 2024",
    // ... full event details
    "participants": [
      {
        "id": "user_id_1",
        "name": "Participant Name",
        "avatar": "https://example.com/avatar.jpg",
        "registeredAt": "2024-01-10T09:15:00.000Z"
      }
    ],
    "organizer": {
      "id": "organizer_id",
      "name": "Event Organizer",
      "avatar": "https://example.com/organizer-avatar.jpg"
    }
  }
}
```

**Error Responses:**
- `404`: Event not found

---

## Create Event

Create a new sports event.

**Endpoint:** `POST /events`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Cricket Championship 2024",
  "description": "Inter-city cricket championship for amateur players",
  "sport": "Cricket",
  "date": "2024-03-15",
  "startTime": "09:00",
  "endTime": "17:00",
  "location": {
    "name": "Oval Ground",
    "address": "Oval Maidan, Fort, Mumbai, Maharashtra 400001",
    "latitude": 18.9267,
    "longitude": 72.8312
  },
  "maxParticipants": 16,
  "entryFee": 500,
  "difficulty": "Intermediate",
  "requirements": ["Age 18-35 years", "Cricket experience required"],
  "prizes": ["Trophy + ₹10,000 (Winner)", "Medal + ₹5,000 (Runner-up)"],
  "isPublic": true,
  "allowSpectators": true,
  "provideEquipment": false,
  "image": "https://example.com/cricket-event.jpg"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "64a7b8c9d1e2f3a4b5c6d7e8",
    // ... created event data
  },
  "message": "Event created successfully"
}
```

**Validation Rules:**
- `title`: Required, minimum 5 characters
- `description`: Required, minimum 20 characters
- `sport`: Required
- `date`: Required, must be future date
- `startTime` & `endTime`: Required, valid time format
- `location.name` & `location.address`: Required
- `maxParticipants`: Required, minimum 2

---

## Update Event

Update an existing event (only by creator).

**Endpoint:** `PUT /events/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Same as create event

**Response (200):**
```json
{
  "success": true,
  "data": {
    // Updated event data
  },
  "message": "Event updated successfully"
}
```

**Error Responses:**
- `403`: Not authorized to update this event
- `404`: Event not found

---

## Delete Event

Delete an event (only by creator).

**Endpoint:** `DELETE /events/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Event deleted successfully"
}
```

---

## Register for Event

Register the authenticated user for an event.

**Endpoint:** `POST /events/:id/register`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "eventId": "64a7b8c9d1e2f3a4b5c6d7e8",
    "userId": "64a7b8c9d1e2f3a4b5c6d7e9",
    "registeredAt": "2024-01-16T10:30:00.000Z"
  },
  "message": "Registered for event successfully"
}
```

**Error Responses:**
- `400`: Already registered or event full
- `404`: Event not found
- `422`: Registration requirements not met

---

## Unregister from Event

Unregister the authenticated user from an event.

**Endpoint:** `DELETE /events/:id/register`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "message": "Unregistered from event successfully"
}
```

---

## Get User's Events

Get events that the user has registered for or created.

**Endpoint:** `GET /users/events`

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): `registered` | `created` | `all` (default: all)
- `status` (optional): Filter by event status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "registeredEvents": [
      // Array of events user registered for
    ],
    "createdEvents": [
      // Array of events user created
    ]
  }
}
```

---

# Sports Information Endpoints

## Get All Sports

Get list of all available sports with information.

**Endpoint:** `GET /sports`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "sport_1",
      "name": "Cricket",
      "category": "Popular",
      "description": "The gentleman's game played with passion across India",
      "image": "https://example.com/cricket.jpg",
      "rules": ["Two teams of 11 players each", "Match formats: Test, ODI, T20"],
      "equipment": ["Cricket bat", "Cricket ball", "Wickets"],
      "olympicStatus": "none",
      "popularCountries": ["India", "Australia", "England"],
      "stats": {
        "totalAthletes": 100000000,
        "worldRecord": "Highest ODI Score: 498/4"
      }
    }
  ]
}
```

---

# News Endpoints

## Get Sports News

Get latest sports news articles.

**Endpoint:** `GET /news`

**Query Parameters:**
- `category` (optional): Filter by sport category
- `limit` (optional): Number of articles (default: 20)
- `page` (optional): Page number (default: 1)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "articles": [
      {
        "id": "news_1",
        "title": "Indian Hockey Team Wins Asian Champions Trophy",
        "summary": "Historic victory against Malaysia in the final",
        "content": "The Indian hockey team created history...",
        "author": "Sports India Reporter",
        "publishedAt": "2024-01-15T10:30:00.000Z",
        "category": "Hockey",
        "sport": "Hockey",
        "image": "https://example.com/hockey-news.jpg",
        "tags": ["hockey", "asian-champions-trophy", "india"],
        "readTime": 4
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 3,
      "totalArticles": 56
    }
  }
}
```

---

# Achievements Endpoints

## Get User Achievements

Get user's achievements and progress.

**Endpoint:** `GET /users/achievements`

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "unlockedAchievements": [
      {
        "id": "achievement_1",
        "title": "First Steps",
        "description": "Join your first sports event",
        "icon": "walk",
        "rarity": "common",
        "category": "Getting Started",
        "xpReward": 50,
        "unlockedAt": "2024-01-01T10:30:00.000Z"
      }
    ],
    "availableAchievements": [
      {
        "id": "achievement_2",
        "title": "Social Butterfly",
        "description": "Make 25+ friends in the community",
        "icon": "account-group",
        "rarity": "common",
        "category": "Social",
        "xpReward": 150,
        "progress": 24,
        "maxProgress": 25,
        "requirements": ["Add 25 friends"]
      }
    ],
    "stats": {
      "totalAchievements": 25,
      "unlockedAchievements": 8,
      "totalXP": 1250,
      "completionRate": 32
    }
  }
}
```

---

# File Upload Endpoints

## Upload Image

Upload profile pictures, event images, etc.

**Endpoint:** `POST /upload/image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: [image file]
type: profile | event | news (optional)
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "url": "https://krida-cdn.example.com/images/profile/user123_avatar.jpg",
    "filename": "user123_avatar.jpg",
    "size": 245760,
    "mimetype": "image/jpeg"
  },
  "message": "Image uploaded successfully"
}
```

---

# Search Endpoints

## Global Search

Search across events, users, and sports.

**Endpoint:** `GET /search`

**Query Parameters:**
- `q`: Search query (required)
- `type` (optional): `events` | `users` | `sports` | `all` (default: all)
- `limit` (optional): Results per type (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "events": [
      // Matching events
    ],
    "users": [
      // Matching users (public profiles only)
    ],
    "sports": [
      // Matching sports
    ],
    "totalResults": 15
  }
}
```

---

# Error Handling

## Common Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "password",
        "message": "Password must be at least 6 characters"
      }
    ]
  }
}
```

### Unauthorized Error (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Authentication required"
  }
}
```

### Forbidden Error (403)
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied"
  }
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource not found"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_SERVER_ERROR",
    "message": "An internal server error occurred"
  }
}
```

---

# Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **File upload endpoints**: 20 requests per minute per user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```

---

# API Versioning

The API uses URL versioning. Current version is v1:

```
http://localhost:4000/api/v1/
```

When breaking changes are introduced, a new version will be created while maintaining backward compatibility for existing versions.

---

# WebSocket Events

For real-time features, the API supports WebSocket connections:

**Connection:** `ws://localhost:4000/ws`

**Authentication:** Send token as first message
```json
{
  "type": "auth",
  "token": "your_jwt_token"
}
```

**Event Types:**
- `event_registered`: User registered for an event
- `event_updated`: Event details changed
- `achievement_unlocked`: New achievement unlocked
- `friend_request`: New friend request received

**Example Event:**
```json
{
  "type": "achievement_unlocked",
  "data": {
    "achievementId": "achievement_1",
    "title": "Marathon Master",
    "xpReward": 200
  },
  "timestamp": "2024-01-16T10:30:00.000Z"
}
```
