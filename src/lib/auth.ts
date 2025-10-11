import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import { connectToDatabaseVIaMongoose } from '@/utils/mongoose';

const CONFIGS = {
  MONGODB_URI: process.env.MONGODB_URI!,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID!,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET!,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
}

const client = new MongoClient(CONFIGS.MONGODB_URI);
const clientPromise = client.connect();

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: CONFIGS.GOOGLE_CLIENT_ID!,
      clientSecret: CONFIGS.GOOGLE_CLIENT_SECRET!,
    }),
    
    // Email/Password Provider
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectToDatabaseVIaMongoose();
          
          const user = await User.findOne({ email: credentials.email });
          
          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  
  session: {
    strategy: 'jwt',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line
        token.role = (user as any).role;
      }
      
      // Store provider info for Google OAuth
      if (account?.provider === 'google') {
        token.provider = 'google';
        // Fetch user role from database for Google OAuth users
        try {
          await connectToDatabaseVIaMongoose();
          const dbUser = await User.findOne({ email: user.email });
          if (dbUser) {
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line
        (session.user as any).id = token.id as string;
        // eslint-disable-next-line
        (session.user as any).role = token.role as string;
      }
      return session;
    },
    
    async signIn({ user, account}) {
      if (account?.provider === 'google') {
        try {
          await connectToDatabaseVIaMongoose();
          
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user for Google OAuth
            await User.create({
              name: user.name,
              email: user.email,
              image: user.image,
              provider: 'google',
              googleId: account.providerAccountId,
              emailVerified: new Date(),
            });
          }
          
          return true;
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      
      return true;
    },
  },
  
  pages: {
    signIn: '/auth/signin',
  },
  
  secret: CONFIGS.NEXTAUTH_SECRET,
};
