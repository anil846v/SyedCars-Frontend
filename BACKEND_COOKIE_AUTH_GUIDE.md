# Backend Cookie-Based Authentication Implementation Guide

## Overview
This guide explains how to modify your backend to support HTTP-only cookie authentication instead of JWT tokens in Authorization headers.

## Changes Required

### 1. Login Endpoint (`/auth/login`)

**Current behavior:** Returns JWT token in response body
```javascript
// Old response
{ token: "jwt_token_here", user: {...} }
```

**New behavior:** Set HTTP-only cookie and return user data
```javascript
// New response
// Set HTTP-only cookie
res.cookie('token', jwtToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production
  sameSite: 'strict', // or 'lax' if needed for cross-origin
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/'
});

// Return user data only
res.json({ user: {...} });
```

### 2. Logout Endpoint (`/auth/logout`)

**New endpoint to add:**
```javascript
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});
```

### 3. Auth Middleware

**Current behavior:** Reads Authorization header
```javascript
// Old middleware
const token = req.headers.authorization?.split(' ')[1];
```

**New behavior:** Read cookie (support both during transition)
```javascript
// New middleware - supports both cookie and header
const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
```

### 4. CORS Configuration (if using Express)

**Important:** For cookies to work in cross-origin requests, you need to configure CORS properly:

```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true, // Required for cookies
}));
```

### 5. Cookie Parser Middleware

**Add cookie-parser to your Express app:**

```bash
npm install cookie-parser
```

```javascript
const cookieParser = require('cookie-parser');
app.use(cookieParser());
```

## Example Implementation (Express)

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Your existing login logic
  const user = await authenticateUser(email, password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  // Generate JWT
  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Set HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/'
  });
  
  // Return user data
  res.json({ user });
});

// Logout endpoint
app.post('/auth/logout', (req, res) => {
  res.clearCookie('token', { path: '/' });
  res.json({ message: 'Logged out successfully' });
});

// Auth middleware
const authenticate = (req, res, next) => {
  // Support both cookie and Authorization header for transition
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route example
app.get('/auth/me', authenticate, async (req, res) => {
  // Your existing logic to get user details
  const user = await getUserById(req.user.userId);
  res.json(user);
});
```

## Environment Variables

Add to your `.env` file:

```env
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Testing

1. **Test login:** Login should set a cookie (check browser DevTools → Application → Cookies)
2. **Test persistence:** Close and reopen browser - should still be logged in
3. **Test logout:** Logout should clear the cookie
4. **Test protected routes:** Should work with cookie authentication

## Security Notes

- **HTTP-only cookies** cannot be accessed by JavaScript (prevents XSS attacks)
- **Secure flag** should be true in production (HTTPS only)
- **SameSite** prevents CSRF attacks
- **MaxAge** ensures cookies expire automatically

## Migration Strategy

The middleware supports both cookies and Authorization headers, so you can:
1. Deploy backend changes first (supports both methods)
2. Deploy frontend changes (switches to cookies)
3. After verification, remove Authorization header support from backend
