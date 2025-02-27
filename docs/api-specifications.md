# LullAIbot Education App - API Specifications

This document outlines the API endpoints required for the LullAIbot Education App. These specifications will guide the development of the backend services that will power the application.

## Base URL

All API endpoints will be relative to the base URL:

```
https://api.lullaibot.edu/v1/
```

## Authentication

All API requests (except for public endpoints) require authentication using JWT tokens.

### Headers

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints

### Authentication

#### Login

```
POST /auth/login
```

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "member"
    }
  }
}
```

#### Register

```
POST /auth/register
```

Request:
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "member"
    }
  }
}
```

### Resources

#### Get All Resources

```
GET /resources
```

Query parameters:
- `category` (optional): Filter by category
- `search` (optional): Search term
- `sort` (optional): Sort field (default: "date")
- `order` (optional): "asc" or "desc" (default: "desc")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

Response:
```json
{
  "status": "success",
  "data": {
    "resources": [
      {
        "id": "resource123",
        "title": "Introduction to AI",
        "description": "A beginner's guide to artificial intelligence",
        "url": "https://example.com/intro-to-ai",
        "category": "Beginner Resources",
        "tags": ["AI", "Beginner"],
        "addedBy": {
          "id": "user123",
          "name": "John Doe"
        },
        "date": "2023-10-15T00:00:00.000Z",
        "votes": 15
      },
      // More resources...
    ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

#### Get Resource by ID

```
GET /resources/:id
```

Response:
```json
{
  "status": "success",
  "data": {
    "resource": {
      "id": "resource123",
      "title": "Introduction to AI",
      "description": "A beginner's guide to artificial intelligence",
      "url": "https://example.com/intro-to-ai",
      "category": "Beginner Resources",
      "tags": ["AI", "Beginner"],
      "addedBy": {
        "id": "user123",
        "name": "John Doe"
      },
      "date": "2023-10-15T00:00:00.000Z",
      "votes": 15,
      "comments": [
        {
          "id": "comment123",
          "text": "This was very helpful!",
          "user": {
            "id": "user456",
            "name": "Jane Smith"
          },
          "date": "2023-10-16T00:00:00.000Z"
        }
      ]
    }
  }
}
```

#### Create Resource

```
POST /resources
```

Request:
```json
{
  "title": "Introduction to AI",
  "description": "A beginner's guide to artificial intelligence",
  "url": "https://example.com/intro-to-ai",
  "category": "Beginner Resources",
  "tags": ["AI", "Beginner"]
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "resource": {
      "id": "resource123",
      "title": "Introduction to AI",
      "description": "A beginner's guide to artificial intelligence",
      "url": "https://example.com/intro-to-ai",
      "category": "Beginner Resources",
      "tags": ["AI", "Beginner"],
      "addedBy": {
        "id": "user123",
        "name": "John Doe"
      },
      "date": "2023-10-15T00:00:00.000Z",
      "votes": 0
    }
  }
}
```

#### Update Resource

```
PUT /resources/:id
```

Request:
```json
{
  "title": "Updated Introduction to AI",
  "description": "An updated beginner's guide to artificial intelligence",
  "category": "Beginner Resources",
  "tags": ["AI", "Beginner", "Guide"]
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "resource": {
      "id": "resource123",
      "title": "Updated Introduction to AI",
      "description": "An updated beginner's guide to artificial intelligence",
      "url": "https://example.com/intro-to-ai",
      "category": "Beginner Resources",
      "tags": ["AI", "Beginner", "Guide"],
      "addedBy": {
        "id": "user123",
        "name": "John Doe"
      },
      "date": "2023-10-15T00:00:00.000Z",
      "updatedAt": "2023-10-16T00:00:00.000Z",
      "votes": 15
    }
  }
}
```

#### Delete Resource

```
DELETE /resources/:id
```

Response:
```json
{
  "status": "success",
  "data": null
}
```

#### Vote for Resource

```
POST /resources/:id/vote
```

Request:
```json
{
  "action": "upvote" // or "downvote"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "votes": 16
  }
}
```

### Categories

#### Get All Categories

```
GET /categories
```

Response:
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "category123",
        "name": "Beginner Resources",
        "description": "Resources for those new to AI",
        "count": 42
      },
      // More categories...
    ]
  }
}
```

#### Create Category

```
POST /categories
```

Request:
```json
{
  "name": "New Category",
  "description": "Description of the new category"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "category": {
      "id": "category456",
      "name": "New Category",
      "description": "Description of the new category",
      "count": 0
    }
  }
}
```

### User Profile

#### Get User Profile

```
GET /users/me
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "user@example.com",
      "bio": "AI enthusiast",
      "avatar": "https://example.com/avatar.jpg",
      "role": "member",
      "stats": {
        "contributions": 15,
        "points": 230,
        "streak": 3,
        "rank": 5
      }
    }
  }
}
```

#### Update User Profile

```
PUT /users/me
```

Request:
```json
{
  "name": "John Smith",
  "bio": "AI and ML enthusiast",
  "avatar": "https://example.com/new-avatar.jpg"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user123",
      "name": "John Smith",
      "email": "user@example.com",
      "bio": "AI and ML enthusiast",
      "avatar": "https://example.com/new-avatar.jpg",
      "role": "member"
    }
  }
}
```

### Achievements

#### Get User Achievements

```
GET /achievements
```

Response:
```json
{
  "status": "success",
  "data": {
    "achievements": [
      {
        "id": "achievement123",
        "name": "First Contribution",
        "description": "Added your first resource",
        "icon": "https://example.com/icons/first-contribution.svg",
        "earnedAt": "2023-10-15T00:00:00.000Z"
      },
      // More achievements...
    ],
    "inProgress": [
      {
        "id": "achievement456",
        "name": "Resource Collector",
        "description": "Add 10 resources",
        "icon": "https://example.com/icons/collector.svg",
        "progress": {
          "current": 3,
          "target": 10
        }
      }
    ]
  }
}
```

### Leaderboard

#### Get Leaderboard

```
GET /leaderboard
```

Query parameters:
- `timeframe` (optional): "weekly", "monthly", "yearly", "all" (default: "all")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 20)

Response:
```json
{
  "status": "success",
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user": {
          "id": "user789",
          "name": "Alice Johnson",
          "avatar": "https://example.com/avatar-alice.jpg"
        },
        "points": 450,
        "contributions": 25
      },
      // More users...
    ],
    "userRank": {
      "rank": 5,
      "user": {
        "id": "user123",
        "name": "John Doe",
        "avatar": "https://example.com/avatar.jpg"
      },
      "points": 230,
      "contributions": 15
    },
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "pages": 5
    }
  }
}
```

### LLM Integration

#### Analyze URL

```
POST /llm/analyze-url
```

Request:
```json
{
  "url": "https://example.com/intro-to-ai"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "metadata": {
      "title": "Introduction to AI",
      "description": "A beginner's guide to artificial intelligence",
      "favicon": "https://example.com/favicon.ico"
    },
    "suggestions": {
      "categories": [
        {
          "category": "Beginner Resources",
          "confidence": 0.92
        },
        {
          "category": "AI Fundamentals",
          "confidence": 0.85
        },
        {
          "category": "General AI Concepts",
          "confidence": 0.78
        }
      ],
      "tags": [
        "AI",
        "Machine Learning",
        "Beginners",
        "Guide"
      ]
    }
  }
}
```

#### Suggest Categories

```
POST /llm/suggest-categories
```

Request:
```json
{
  "title": "Introduction to AI",
  "description": "A beginner's guide to artificial intelligence",
  "content": "Optional extracted content from the URL"
}
```

Response:
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "category": "Beginner Resources",
        "confidence": 0.92
      },
      {
        "category": "AI Fundamentals",
        "confidence": 0.85
      },
      {
        "category": "General AI Concepts",
        "confidence": 0.78
      }
    ]
  }
}
```

## Error Handling

All endpoints follow a consistent error format:

```json
{
  "status": "error",
  "error": {
    "code": "resource_not_found",
    "message": "The requested resource was not found"
  }
}
```

Common error codes:
- `unauthorized`: Authentication required
- `forbidden`: Permission denied
- `resource_not_found`: Resource not found
- `validation_error`: Invalid input
- `server_error`: Internal server error

## Rate Limiting

API requests are rate limited to 100 requests per minute per user. When the limit is exceeded, the API will respond with a 429 Too Many Requests status code.

## Versioning

The API uses a versioned URL structure (v1) to ensure backward compatibility as features evolve.

## Webhooks

For future implementation, webhooks will be available for real-time notifications of events such as:
- New resource added
- Achievement unlocked
- Comment received
- Category approved

## Data Models

### Resource
- id: string
- title: string
- description: string
- url: string
- category: string
- tags: string[]
- addedBy: User reference
- date: Date
- updatedAt: Date (optional)
- votes: number
- comments: Comment[] (optional)

### User
- id: string
- name: string
- email: string
- password: string (hashed, never returned in API)
- bio: string (optional)
- avatar: string (optional)
- role: string (member, admin)
- stats: UserStats

### UserStats
- contributions: number
- points: number
- streak: number
- rank: number

### Achievement
- id: string
- name: string
- description: string
- icon: string
- earnedAt: Date (if earned)
- progress: AchievementProgress (if in progress)

### AchievementProgress
- current: number
- target: number

### Category
- id: string
- name: string
- description: string
- count: number

### Comment
- id: string
- text: string
- user: User reference
- date: Date

## Implementation Notes

- The API will be implemented using Node.js with Express
- MongoDB will be used as the primary database
- JWT will be used for authentication
- OpenAI API or similar will be used for LLM integration
- Redis will be used for caching and rate limiting 