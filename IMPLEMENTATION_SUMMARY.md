# URL Shortener - Enhanced with Redis, QR Codes & Modern UI

## Overview

This is an enhanced full-stack URL shortener application built with:
- **Backend**: Express.js, MongoDB, Redis (optional), JavaScript
- **Frontend**: React, Vite, Tailwind CSS, JavaScript
- **Features**: URL shortening, click tracking, QR code generation, Redis caching

## What Was Added

### 1. Redis Caching
- **Files**: 
  - `server/src/config/redisConfig.js` - Redis connection and initialization
  - `server/src/utils/cacheManager.js` - Cache management utilities
  
- **Features**:
  - Cache short URL → full URL mappings
  - Automatic cache population when URLs are created or fetched
  - Smart redirect flow: Check Redis first → if miss, fetch from MongoDB → store in cache
  - Cache key format: `url:<shortCode>` (clean namespacing)
  - 7-day TTL for cached items
  - Graceful fallback if Redis is unavailable (app continues to work with just MongoDB)
  - Automatic reconnection strategy for Redis

### 2. QR Code Generation
- **Files**:
  - `server/src/utils/qrCodeGenerator.js` - QR code generation utility
  - `client/src/components/QRCode/QRCodeModal.jsx` - QR display modal
  
- **Features**:
  - QR codes generated dynamically (no database storage needed)
  - Included in API responses for all URL operations
  - QR code data URLs (base64 encoded PNG)
  - Download QR code as PNG file
  - Beautiful modal popup for QR display
  - Fallback handling if QR generation fails

### 3. Modern, Production-Quality UI
- **Updated Components**:
  - `Header` - Sticky navigation with modern design
  - `Footer` - Rich footer with links and copyright
  - `FormContainer` - Gradient background, modern form with validation and loading states
  - `DataTable` - Responsive table for desktop and card layout for mobile
  - `App.jsx` - Integrated toast notifications
  
- **Features**:
  - Toast notifications for success/error/info messages (react-toastify)
  - Loading states with spinner animations
  - Empty state handling
  - Responsive design (mobile-first)
  - Modern gradient backgrounds
  - Improved spacing and typography
  - Hover effects and transitions
  - Copy-to-clipboard with feedback
  - URL validation before shortening
  - Success/error feedback for all operations

### 4. Better Code Quality
- Implemented in JavaScript (no TypeScript)
- Improved error handling with try-catch
- Graceful degradation (Redis optional)
- Clean separation of concerns
- Modular utilities
- Console logging for debugging
- Proper HTTP status codes
- Input validation

## Installation & Setup

### Prerequisites
- Node.js (v16+)
- MongoDB running locally or remote connection string
- Redis (optional, for caching - app works without it)

### Backend Setup

```bash
cd server
npm install
```

**Configure environment variables** (`.env` file):
```env
CONNECTION_STRING=mongodb://127.0.0.1:27017/url_shortener
PORT=5001

# Optional Redis configuration (if not set, app works without Redis)
REDIS_URL=redis://localhost:6379
# OR individual settings:
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Start the backend**:
```bash
npm run dev
```

The server will start on `http://localhost:5001`

### Frontend Setup

```bash
cd client
npm install
```

**Start the frontend**:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## API Endpoints

### Create Shortened URL
```
POST /api/shortUrl
Body: { "fullUrl": "https://example.com/very/long/url" }
Response: { _id, fullUrl, shortUrl, clicks, createdAt, updatedAt, qrCode }
```

### Get All Shortened URLs
```
GET /api/shortUrl
Response: Array of URL objects with QR codes
```

### Get Specific URL (with QR)
```
GET /api/shortUrl/:id
Response: { _id, fullUrl, shortUrl, clicks, createdAt, updatedAt, qrCode }
```

### Get QR Code Only
```
GET /api/shortUrl/:id/qr
Response: { qrCode (data URL), shortUrl }
```

### Delete URL
```
DELETE /api/shortUrl/:id
Response: { message: "URL successfully deleted" }
```

### Redirect Route (with caching)
```
GET /r/:shortUrl
- Checks Redis cache first
- Falls back to MongoDB if cache miss
- Updates click count
- Stores in cache for future requests
```

## How Redis Caching Works

1. **When a URL is created**:
   - URL is saved to MongoDB
   - Short URL → Full URL mapping is cached in Redis (key: `url:<shortCode>`)

2. **When redirecting**:
   - Server checks Redis first
   - If found (cache hit), immediately redirect
   - If not found (cache miss), query MongoDB
   - Store in Redis for future requests
   - Redirect to full URL
   - Click count updated in MongoDB

3. **When cache is unavailable**:
   - Redis connection fails? No problem!
   - App automatically falls back to MongoDB-only mode
   - No errors, app continues to work normally

4. **Cache expiration**:
   - 7-day TTL on cached items
   - After 7 days, cache entry expires
   - Next access re-populates from MongoDB

## How QR Code Generation Works

- QR codes are generated **on-demand** using the `qrcode` library
- Each URL gets a QR code that encodes: `http://localhost:5001/r/<shortCode>`
- QR codes are NOT stored in the database (generated dynamically)
- Format: Base64 data URL (PNG image)
- Can be downloaded as PNG file from the UI
- User-friendly: shown in a modal with download button

## Features & Usage

### Shorten a URL
1. Enter a URL in the form at the top
2. Click "Shorten URL"
3. Success toast appears
4. URL appears in the table below

### View QR Code
1. Click the QR icon on any URL row
2. Modal opens showing the QR code
3. Click "Download QR" to save as PNG
4. Scan with any QR reader to access the shortened URL

### Copy Short URL
1. Click the copy icon on any row
2. Toast confirms: "Copied: [shortCode]"
3. Full short URL is copied to clipboard

### Delete URL
1. Click the delete icon on any row
2. Confirm the deletion
3. URL is removed from database and cache
4. Toast confirms deletion

### Track Clicks
- Each row shows the number of times the shortened URL was visited
- Updated in real-time when cache refreshes

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Primary database
- **Mongoose** - ODM
- **Redis** - Caching layer (optional)
- **qrcode** - QR code generation
- **JavaScript** - Implementation language
- **CORS** - Cross-origin requests
- **dotenv** - Environment variables

### Frontend
- **React** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Router** - Routing (preinstalled)
- **React Toastify** - Notifications
- **JavaScript** - Implementation language

## Performance Benefits

1. **Redis Caching**:
   - Faster redirects for cached URLs and reduced MongoDB load
   - Lower latency for popular URLs

2. **Optimized Frontend**:
   - Built with Vite for fast development server and optimized production builds
   - No automatic code-splitting or React.lazy usage in the current codebase
   - Efficient state management

3. **Responsive Design**:
   - Mobile-optimized
   - Responsive, performant UI with CSS and JS animations

## Error Handling

- **Database errors**: User-friendly error messages
- **Redis unavailable**: Automatic fallback to MongoDB
- **Network errors**: Toast notifications with retry options
- **Invalid URLs**: Form validation with helpful messages
- **Missing resources**: Empty state displays

## Development Notes

- All code is fully runtime-safe (JavaScript)
- Console logs for debugging (use browser DevTools)
- Server logs show cache hits/misses
- Graceful error handling throughout
- No external dependencies for critical features
- Can work completely without Redis

## Troubleshooting

### Redis connection fails
- Check if Redis is running: `redis-cli ping`
- Verify `REDIS_HOST` and `REDIS_PORT` in `.env`
- App will continue to work without Redis

### QR codes not showing
- Check browser console for errors
- Ensure `qrcode` package is installed
- Refresh the page

### URLs not showing in table
- Check network tab in browser DevTools
- Verify backend is running on port 5001
- Check MongoDB connection in server logs

### CORS errors
- Ensure the frontend origin is included in `FRONTEND_ORIGINS` (defaults include `http://localhost:3000` and `http://localhost:3001`)
- Check CORS configuration in `server.js`

## Author
URL Shortener - Enhanced Edition