# URL Shortener Authentication System Documentation

## Overview

This document describes the complete authentication and user-based URL management system added to the MERN stack URL shortener project.

## Architecture

### Backend (Node.js + Express + MongoDB)

#### 1. User Model (`server/src/model/user.js`)
- **name**: User's full name
- **email**: Unique email address
- **password**: Hashed using bcrypt (10 salt rounds)
- **timestamps**: createdAt and updatedAt

Methods:
- `comparePassword()`: Securely compare entered password with hashed password

#### 2. Updated URL Model (`server/src/model/shortUrl.js`)
- **user**: ObjectId reference to User model (required)
- All URLs now belong to a specific user
- Users can only access their own URLs

#### 3. Authentication Routes (`server/src/routes/auth.js`)

**POST /api/auth/register**
- Register a new user
- Body: `{ name, email, password, confirmPassword }`
- Returns: `{ message, token, user }`
- Validates: Email uniqueness, password confirmation

**POST /api/auth/login**
- Authenticate user
- Body: `{ email, password }`
- Returns: `{ message, token, user }`
- Uses JWT with 7-day expiration

**GET /api/auth/me** (Protected)
- Get current logged-in user info
- Headers: `Authorization: Bearer <token>`
- Returns: `{ user }`

#### 4. Auth Middleware (`server/src/middleware/authMiddleware.js`)
- Verifies JWT token from Authorization header
- Extracts user ID and attaches to request object
- Rejects expired or invalid tokens
- Error handling for token validation failures

#### 5. Protected URL Routes (`server/src/routes/shortUrl.js`)

All URL endpoints now require authentication:

**POST /api/shortUrl** (Protected)
- Create shortened URL for authenticated user
- User ID is automatically saved with URL

**GET /api/shortUrl** (Protected)
- Get only logged-in user's URLs
- Cannot see other users' URLs

**GET /api/shortUrl/:id** (Protected)
- Get specific URL details (user must own it)
- Verifies ownership before returning data

**GET /api/shortUrl/:id/qr** (Protected)
- Get QR code (user must own the URL)
- Prevents unauthorized access

**DELETE /api/shortUrl/:id** (Protected)
- Delete URL (user must own it)
- Verifies ownership before deletion

**GET /r/:shortUrl** (Public)
- Redirect to original URL (no auth required)
- Anyone with short URL can access it
- Click counting still works

### Frontend (React + JavaScript)

#### 1. Auth Context (`src/context/AuthContext.jsx`)
Provides authentication state and methods:
- `user`: Current user object
- `token`: JWT token stored in localStorage
- `isAuthenticated`: Boolean flag
- `isLoading`: Loading state during auth checks
- Methods:
  - `login(email, password)`: Authenticate user
  - `register(name, email, password, confirmPassword)`: Create account
  - `logout()`: Clear auth state
  - `checkAuth()`: Verify token validity

#### 2. Axios Interceptor (`src/utils/axiosConfig.js`)
- Automatically attaches JWT token to all requests
- Handles 401 errors by redirecting to login
- Token stored in localStorage persists across page refreshes

#### 3. Protected Route (`src/components/ProtectedRoute/ProtectedRoute.jsx`)
- Guards routes requiring authentication
- Redirects unauthenticated users to login
- Shows loading state while checking auth

#### 4. Login Page (`src/pages/Login.jsx`)
- Beautiful glassmorphic UI matching design system
- Email validation
- Password validation
- Loading state with spinner
- Link to register page
- Toast notifications for errors

#### 5. Register Page (`src/pages/Register.jsx`)
- User registration form
- Fields: name, email, password, confirm password
- Validation:
  - Name (2+ characters)
  - Email format validation
  - Password (6+ characters)
  - Password confirmation match
- Toast notifications
- Link to login page

#### 6. Updated Header (`src/components/Header/Header.jsx`)
- Shows user's name and online status indicator
- Dropdown menu with:
  - User name and email
  - Logout button
- Styled with glassmorphism design

#### 7. Updated App Routes (`src/App.jsx`)
- BrowserRouter setup
- AuthProvider wrapper
- Route structure:
  - `/login` - Public (redirects to dashboard if authenticated)
  - `/register` - Public (redirects to dashboard if authenticated)
  - `/` - Protected dashboard
- Loading state while checking authentication

## Security Features

### Backend Security

1. **Password Hashing**
   - Uses bcrypt with 10 salt rounds
   - Passwords never stored in plain text
   - Compared securely during login

2. **JWT Tokens**
   - Signed with JWT_SECRET environment variable
   - 7-day expiration
   - Contains userId, email, name

3. **Environment Variables**
   - JWT_SECRET: Secret key for token generation (change in production)
   - MONGO_URI: Database connection string
   - Never commit .env to version control

4. **Input Validation**
   - Email format validation
   - Password confirmation check
   - Duplicate email prevention
   - URL validation

5. **Authorization**
   - Users can only access their own URLs
   - URL ownership verified before operations
   - Public redirect endpoint remains accessible

### Frontend Security

1. **Token Storage**
   - JWT stored in localStorage
   - Accessible to JS (consider httpOnly cookies for production)
   - Cleared on logout

2. **Axios Interceptor**
   - Automatically attaches token to requests
   - Handles token expiration
   - Redirects to login on 401 errors

3. **Protected Routes**
   - Routes guarded with ProtectedRoute component
   - Redirects to login if not authenticated

## API Response Examples

### Register
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get User Info (/api/auth/me)
```json
{
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2024-05-27T10:30:00Z"
  }
}
```

### Create URL (Protected)
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "fullUrl": "https://www.example.com/long/url",
  "shortUrl": "abc123def4",
  "user": "507f1f77bcf86cd799439011",
  "clicks": 0,
  "qrCode": "data:image/png;base64...",
  "createdAt": "2024-05-27T10:30:00Z",
  "updatedAt": "2024-05-27T10:30:00Z"
}
```

### Get All User's URLs
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "fullUrl": "https://www.example.com",
    "shortUrl": "abc123def4",
    "user": "507f1f77bcf86cd799439011",
    "clicks": 5,
    "qrCode": "data:image/png;base64...",
    "createdAt": "2024-05-27T10:30:00Z",
    "updatedAt": "2024-05-27T10:30:00Z"
  }
]
```

## Error Handling

### Authentication Errors

**400 - Bad Request**
- Missing required fields
- Invalid email format
- Password length < 6
- Passwords don't match
- Empty URL

**401 - Unauthorized**
- Invalid credentials
- Token expired
- No token provided
- Invalid token format

**409 - Conflict**
- User with email already exists

**404 - Not Found**
- URL not found
- User not found
- URL doesn't belong to user

**500 - Internal Server Error**
- Database errors
- Server errors

## Setup Instructions

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

2. **Update .env**
   ```env
   CONNECTION_STRING=mongodb://127.0.0.1:27017/url_shortener
   PORT=5001
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
   ```

3. **Start Server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd client
   npm install
   ```

2. **Update .env**
   ```env
   VITE_SERVER_URL=http://localhost:5001/api
   VITE_API_URL=http://localhost:5001
   ```

3. **Start App**
   ```bash
   npm run dev
   ```

## User Flow

1. **Registration**
   - User visits /register
   - Enters name, email, password
   - System validates and creates account
   - JWT token generated and stored
   - User redirected to dashboard

2. **Login**
   - User visits /login
   - Enters email and password
   - Credentials verified
   - JWT token generated and stored
   - User redirected to dashboard

3. **Dashboard Access**
   - Protected route checks authentication
   - If no token, redirects to login
   - If token invalid/expired, redirects to login
   - Shows user info in header
   - Displays only user's URLs

4. **URL Operations**
   - Create: Save URL with user ID
   - Read: Fetch only user's URLs
   - Update: N/A (URLs don't update)
   - Delete: Only if user owns URL

5. **Logout**
   - User clicks logout in dropdown
   - Token cleared from localStorage
   - User redirected to login page

## Production Deployment

### Security Recommendations

1. **Change JWT_SECRET**
   - Generate strong random secret
   - Use environment-specific secrets
   - Never commit secrets to repo

2. **HTTPS Only**
   - Use HTTPS in production
   - Set secure cookies flag

3. **Token Storage**
   - Consider using httpOnly cookies instead of localStorage
   - Implement refresh token rotation

4. **Rate Limiting**
   - Limit auth endpoint requests
   - Prevent brute force attacks

5. **CORS Configuration**
   - Update to production domain
   - Remove localhost from production

6. **Database Security**
   - Use strong MongoDB passwords
   - Enable authentication
   - Use connection pooling

7. **Input Sanitization**
   - Validate all inputs server-side
   - Escape output data
   - Use parameterized queries

## Testing the Auth System

### Manual Testing

1. **Register New User**
   - Go to http://localhost:3001/register
   - Fill in form with new user details
   - Verify redirected to dashboard
   - Check browser localStorage for authToken

2. **Login**
   - Logout from dropdown menu
   - Go to http://localhost:3001/login
   - Enter credentials
   - Verify redirected to dashboard

3. **Protected Routes**
   - Clear localStorage (remove authToken)
   - Try accessing http://localhost:3001/
   - Verify redirected to login

4. **Create URL**
   - Create shortened URL
   - Verify only your URLs appear
   - Verify click counts work

5. **Token Expiration**
   - JWT expires after 7 days
   - System will redirect to login on next request
   - User needs to login again

## File Structure

```
server/
├── src/
│   ├── controllers/
│   │   ├── auth.js (NEW)
│   │   └── shortUrl.js (UPDATED)
│   ├── middleware/
│   │   └── authMiddleware.js (NEW)
│   ├── model/
│   │   ├── user.js (NEW)
│   │   └── shortUrl.js (UPDATED)
│   ├── routes/
│   │   ├── auth.js (NEW)
│   │   └── shortUrl.js (UPDATED)
│   └── server.js (UPDATED)
├── .env (UPDATED)
└── package.json (UPDATED)

client/
├── src/
│   ├── context/
│   │   └── AuthContext.jsx (NEW)
│   ├── pages/
│   │   ├── Login.jsx (NEW)
│   │   └── Register.jsx (NEW)
│   ├── components/
│   │   ├── Header/ (UPDATED)
│   │   ├── ProtectedRoute/ (NEW)
│   │   └── (others unchanged)
│   ├── utils/
│   │   └── axiosConfig.js (NEW)
│   └── App.jsx (UPDATED)
├── .env (UPDATED)
└── package.json
```

## Troubleshooting

### "Token expired" Error
- Token has expired after 7 days
- User needs to login again
- Frontend automatically redirects to login

### "Unauthorized" Error
- Token not sent in request
- Token is invalid or malformed
- Check axios interceptor is configured
- Verify token in localStorage

### CORS Error
- Backend CORS not configured for frontend URL
- Update CORS origins in server.js

### User Can See Other Users' URLs
- Check URL queries filter by user ID
- Verify authMiddleware is applied
- Confirm ownership checks in delete endpoint

### Password Hash Issues
- Ensure bcrypt is installed
- Check Node.js version (bcrypt requires >= 8.0.0)
- Verify pre-save hook on User model

## Future Improvements

1. **Password Reset**
   - Email verification
   - Reset token expiration

2. **Two-Factor Authentication**
   - SMS or email codes
   - TOTP support

3. **Refresh Tokens**
   - Implement refresh token rotation
   - Extend session without re-login

4. **OAuth Integration**
   - Google/GitHub login
   - Social authentication

5. **Account Management**
   - Change password
   - Update profile
   - Delete account

6. **URL Sharing**
   - Share URLs with other users
   - Collaborative link management

7. **Advanced Analytics**
   - Geographic click data
   - Referrer tracking
   - Device analytics

## Support

For issues or questions:
1. Check this documentation
2. Review error messages in browser console
3. Check backend logs
4. Verify .env configuration
5. Ensure MongoDB is running
6. Check API endpoints with Postman
