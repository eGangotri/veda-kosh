# Authentication Setup Guide

## Overview
Your Veda Kosh application now has a complete authentication system with:
- Email/Password authentication
- Google OAuth login
- User registration
- Session management
- Protected routes

## Setup Instructions

### 1. Environment Variables
Copy the `env.example` file to `.env.local` and fill in the required values:

```bash
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/veda-kosh

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 2. Generate NextAuth Secret
Run this command to generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3001/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env.local`

## Features Implemented

### Authentication Pages
- **Sign In**: `/auth/signin` - Login with email/password or Google
- **Sign Up**: `/auth/signup` - Register new account with email/password

### API Routes
- **NextAuth**: `/api/auth/[...nextauth]` - Handles all authentication flows
- **Registration**: `/api/auth/register` - User registration endpoint

### Components
- **AuthButton**: Shows login/logout buttons in navigation
- **SessionProvider**: Wraps app with authentication context
- **ProtectedRoute**: Component to protect pages requiring authentication

### Database
- **User Model**: MongoDB schema for user data with support for both credential and OAuth users

## Usage Examples

### Protecting a Page
```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ProtectedPage() {
  return (
    <ProtectedRoute>
      <div>This content requires authentication</div>
    </ProtectedRoute>
  );
}
```

### Using Session in Components
```tsx
import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <p>Loading...</p>;
  if (!session) return <p>Not signed in</p>;

  return <p>Signed in as {session.user?.email}</p>;
}
```

### Server-side Session Access
```tsx
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function ServerComponent() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return <div>Not authenticated</div>;
  }

  return <div>Hello {session.user?.name}</div>;
}
```

## Security Features
- Passwords hashed with bcrypt (12 rounds)
- CSRF protection via NextAuth
- Secure session management
- Input validation and sanitization
- Email format validation
- Password strength requirements (minimum 6 characters)

## Testing the Setup
1. Start your development server: `pnpm dev`
2. Navigate to `http://localhost:3001`
3. Click "Sign Up" to create a new account
4. Try signing in with email/password
5. Test Google OAuth login
6. Check that the user menu appears when logged in

## Troubleshooting
- Ensure MongoDB is running and accessible
- Verify all environment variables are set correctly
- Check Google OAuth configuration and redirect URIs
- Make sure NextAuth secret is generated and set
- Verify the MongoDB connection string format
