import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';
import { prisma } from '../../../lib/prisma';

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
  };
} | {
  error: string;
};

/**
 * POST /api/auth/login
 * Login user dengan email dan password
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
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

    // Login dengan Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user || !data.session) {
      return res.status(401).json({ 
        error: 'Invalid credentials' 
      });
    }

    // Cek apakah user sudah ada di database, jika belum create
    let user = await prisma.user.findUnique({
      where: { id: data.user.id },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email!,
          name: data.user.user_metadata?.name || null,
        },
      });
    }

    // Return token dan user data
    return res.status(200).json({
      token: data.session.access_token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
