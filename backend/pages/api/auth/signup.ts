import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';
import { prisma } from '../../../lib/prisma';

type SignupResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
  };
} | {
  error: string;
};

/**
 * POST /api/auth/signup
 * Register user baru dengan email dan password
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignupResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user already exists in Auth
    const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingAuthUser = existingAuthUsers?.users?.find(u => u.email === email);

    let authUser;
    
    if (existingAuthUser) {
      // User exists in Auth, check if also in database
      const dbUser = await prisma.user.findUnique({
        where: { id: existingAuthUser.id },
      });

      if (dbUser) {
        // User exists in both Auth and Database - this is a real duplicate
        return res.status(400).json({ 
          error: 'This email is already registered. Please login instead.' 
        });
      }

      // User exists in Auth but not in Database - sync it
      authUser = existingAuthUser;
      console.log('Syncing existing auth user to database:', email);
    } else {
      // Create new user in Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          name: email.split('@')[0],
        },
      });

      if (error) {
        console.error('Supabase signup error:', error);
        return res.status(400).json({ 
          error: error.message || 'Failed to create account' 
        });
      }

      if (!data.user) {
        return res.status(400).json({ 
          error: 'Account creation failed. Please try again.' 
        });
      }

      authUser = data.user;
    }

    // Create user di database
    const user = await prisma.user.create({
      data: {
        id: authUser.id,
        email: authUser.email!,
        name: authUser.user_metadata?.name || null,
      },
    });

    // Auto-login after signup
    const { data: loginData, error: loginError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError || !loginData.session) {
      console.error('Auto-login error:', loginError);
      // If auto-login fails, return error - user harus login manual
      return res.status(500).json({
        error: 'Account created but auto-login failed. Please login manually.',
      });
    }

    // Return session token, refresh token, dan user data
    return res.status(201).json({
      token: loginData.session.access_token,
      refreshToken: loginData.session.refresh_token,
      expiresIn: loginData.session.expires_in || 3600,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle Prisma unique constraint error
    if (error.code === 'P2002') {
      return res.status(400).json({ 
        error: 'An account with this email already exists' 
      });
    }
    
    return res.status(500).json({ 
      error: error.message || 'Internal server error during signup' 
    });
  }
}
