# JWT Access & Refresh Token Flow Guide

## Overview

The authentication system uses a two-token approach:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

This approach provides better security while maintaining good user experience.

---

## Token Specifications

### Access Token

- **Expiry**: 15 minutes (900 seconds)
- **Purpose**: API authentication
- **Storage**: Memory/sessionStorage (frontend)
- **Header**: `Authorization: Bearer <accessToken>`
- **Contains**: userId, email, role, type="access"

### Refresh Token

- **Expiry**: 7 days
- **Purpose**: Get new access token without re-login
- **Storage**: localStorage (frontend) + Database (backend)
- **Rotating**: Invalidated on password change, logout, or manual revocation
- **Contains**: userId, type="refresh"

---

## Authentication Flow

### 1. Registration

**Request:**

```graphql
mutation {
  registerUser(
    name: "John Doe"
    email: "john@example.com"
    password: "securePassword123"
    phone: "1234567890"
  ) {
    id
    name
    email
    accessToken
    refreshToken
    expiresIn
  }
}
```

**Response:**

```json
{
  "data": {
    "registerUser": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Frontend Action:**

```javascript
// Store tokens
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("refreshToken", response.refreshToken);
localStorage.setItem("expiresAt", Date.now() + response.expiresIn * 1000);
```

---

### 2. Login

**Request:**

```graphql
mutation {
  loginUser(email: "john@example.com", password: "securePassword123") {
    id
    name
    email
    accessToken
    refreshToken
    expiresIn
  }
}
```

**Response:** (Same as registration)

---

### 3. Using Access Token for API Calls

**Example: Get User Profile**

```graphql
{
  userProfile {
    id
    name
    email
    phone
    role
  }
}
```

**Frontend Request with Authorization:**

```javascript
const accessToken = localStorage.getItem("accessToken");

const response = await fetch("http://localhost:4000/graphql", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`, // Include token
  },
  body: JSON.stringify({
    query: `{ userProfile { id name email } }`,
  }),
});
```

### Error: Access Token Expired

If access token expires, API will return:

```json
{
  "errors": [
    {
      "message": "Invalid access token",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

---

### 4. Refresh Access Token

When access token expires, use refresh token to get a new one.

**Request:**

```graphql
mutation {
  refreshAccessToken(refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...") {
    accessToken
    expiresIn
  }
}
```

**Response:**

```json
{
  "data": {
    "refreshAccessToken": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 900
    }
  }
}
```

**Frontend Action:**

```javascript
// Update stored token and expiry
localStorage.setItem("accessToken", response.accessToken);
localStorage.setItem("expiresAt", Date.now() + response.expiresIn * 1000);

// Retry original request
```

**Error: Refresh Token Expired or Invalid**

```json
{
  "errors": [
    {
      "message": "Token refresh failed: Refresh token expired",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

When refresh token expires, user must login again.

---

## Frontend Implementation

### Token Management Service

```javascript
// lib/tokenService.js

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const EXPIRES_AT_KEY = "expiresAt";

export const tokenService = {
  // Store tokens after login
  setTokens: (accessToken, refreshToken, expiresIn) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(EXPIRES_AT_KEY, Date.now() + expiresIn * 1000);
  },

  // Get current access token
  getAccessToken: () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Check if access token is expired
  isAccessTokenExpired: () => {
    const expiresAt = localStorage.getItem(EXPIRES_AT_KEY);
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt);
  },

  // Clear all tokens (logout)
  clearTokens: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  },
};
```

### GraphQL Client with Auto-Refresh

```javascript
// api/graphql.ts

import { tokenService } from '../lib/tokenService';

const GRAPHQL_ENDPOINT = 'http://localhost:4000/graphql';

export const graphqlQuery = async (
  query: string,
  variables?: Record<string, any>
) => {
  let accessToken = tokenService.getAccessToken();

  // Check and refresh token if needed
  if (tokenService.isAccessTokenExpired()) {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('Session expired. Please login again.');
    }

    try {
      const refreshResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            mutation RefreshToken($refreshToken: String!) {
              refreshAccessToken(refreshToken: $refreshToken) {
                accessToken
                expiresIn
              }
            }
          `,
          variables: { refreshToken }
        })
      });

      const refreshData = await refreshResponse.json();

      if (refreshData.errors) {
        tokenService.clearTokens();
        throw new Error('Session expired. Please login again.');
      }

      const { accessToken: newAccessToken, expiresIn } = refreshData.data.refreshAccessToken;
      tokenService.setTokens(newAccessToken, refreshToken, expiresIn);
      accessToken = newAccessToken;
    } catch (error) {
      tokenService.clearTokens();
      window.location.href = '/login';
      throw error;
    }
  }

  // Make API request with access token
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await response.json();

  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data;
};
```

### Login Component Example

```typescript
// pages/Login.tsx

import { useState } from 'react';
import { graphqlQuery } from '../api/graphql';
import { tokenService } from '../lib/tokenService';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await graphqlQuery(`
        mutation LoginUser($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            id
            name
            email
            role
            accessToken
            refreshToken
            expiresIn
          }
        }
      `, { email, password });

      const { accessToken, refreshToken, expiresIn, role } = data.loginUser;

      // Store tokens
      tokenService.setTokens(accessToken, refreshToken, expiresIn);

      // Store user info in state/context
      localStorage.setItem('userId', data.loginUser.id);

      // Redirect based on role
      window.location.href = role === 'admin' ? '/admin' : '/';
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

---

## Backend Environment Variables

Create a `.env` file in the `BackEnd` folder:

```env
# Token Secrets
ACCESS_TOKEN_SECRET=your-access-token-secret-key-change-this-in-production
REFRESH_TOKEN_SECRET=your-refresh-token-secret-key-change-this-in-production

# MongoDB
MONGODB_URI=mongodb://localhost:27017/lumina-ecommerce

# Email Service (Nodemailer)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server
PORT=4000
NODE_ENV=development
```

---

## Security Best Practices

### 1. Token Storage

**DO:**

- Store access token in memory or sessionStorage
- Store refresh token in httpOnly cookie (most secure)
- Or store refresh token in localStorage with expiry checks

**DON'T:**

- Never store access token in localStorage (XSS vulnerability)
- Never expose tokens in URLs
- Never log tokens to console in production

### 2. Token Rotation

- Generate new refresh token on sensitive operations
- Invalidate old refresh tokens after rotation
- Clear refresh token on password change
- Clear refresh token on logout

### 3. HTTPS

- Always use HTTPS in production
- Never send tokens over HTTP
- Implement CORS properly

### 4. Token Validation

```javascript
// Middleware to validate access token in Express
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
```

### 5. Token Blacklist (Optional)

For sensitive operations, maintain a token blacklist:

```javascript
// Store revoked tokens with expiry
const tokenBlacklist = new Map();

export const revokeToken = (token, expiresIn) => {
  tokenBlacklist.set(token, Date.now() + expiresIn * 1000);
};

// Check blacklist during authentication
if (tokenBlacklist.has(token)) {
  throw new Error("Token has been revoked");
}
```

---

## Common Scenarios

### Scenario 1: User Makes Request with Expired Access Token

1. User makes API request
2. Backend returns "Invalid access token" error
3. Frontend detects error code 401
4. Frontend calls `refreshAccessToken` mutation
5. Refresh token used to get new access token
6. Original request retried with new token
7. If refresh token expired, user redirected to login

### Scenario 2: User Changes Password

1. User submits old and new password
2. Backend validates old password
3. Backend invalidates refresh token (sets to null)
4. Backend returns success
5. Frontend redirects to login
6. User must login again with new password

### Scenario 3: User Logs Out

1. User clicks logout
2. Frontend clears all tokens from localStorage
3. Frontend redirects to login page
4. Backend removes refresh token from database (optional)

### Scenario 4: Token Refresh Fails

1. Access token expires
2. Frontend attempts to refresh
3. Refresh token is also expired or invalid
4. Backend returns "Refresh token expired"
5. Frontend clears tokens and redirects to login
6. User must re-authenticate

---

## Testing with GraphQL Playground

### 1. Register User

```graphql
mutation RegisterTest {
  registerUser(
    name: "Test User"
    email: "test@example.com"
    password: "testPassword123"
    phone: "9876543210"
  ) {
    id
    name
    email
    accessToken
    refreshToken
    expiresIn
  }
}
```

### 2. Set Authorization Header

In GraphQL Playground, go to HTTP HEADERS (bottom left):

```json
{
  "Authorization": "Bearer <paste-accessToken-here>"
}
```

### 3. Test Protected Query

```graphql
{
  userProfile {
    id
    name
    email
    role
  }
}
```

### 4. Test Token Refresh

```graphql
mutation RefreshTest {
  refreshAccessToken(refreshToken: "<paste-refreshToken-here>") {
    accessToken
    expiresIn
  }
}
```

---

## Troubleshooting

| Issue                     | Solution                                        |
| ------------------------- | ----------------------------------------------- |
| "Invalid access token"    | Token expired, use refresh token to get new one |
| "Refresh token expired"   | User must login again                           |
| "No token provided"       | Include Authorization header in request         |
| "Token has been revoked"  | User logged out or password changed             |
| Access token not updating | Clear browser storage and re-login              |
| Refresh token not working | Check token expiry in database                  |

---

## Migration from Old System

If using old single-token system:

1. Update User model with refreshToken field
2. Update UserController with new functions
3. Update GraphQL schema
4. Update frontend to use new token structure
5. Old tokens will not work (user must re-login)
6. Gradual rollout recommended
