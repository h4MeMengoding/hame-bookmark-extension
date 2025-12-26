import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../../../lib/supabase';

type RefreshResponse = {
  token: string;
  refreshToken: string;
  expiresIn: number;
} | {
  error: string;
};

/**
 * POST /api/auth/refresh
 * Refresh access token menggunakan refresh token
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RefreshResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Refresh session menggunakan refresh token
    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.session) {
      console.error('Token refresh error:', error);
      return res.status(401).json({ 
        error: 'Invalid or expired refresh token. Please login again.' 
      });
    }

    // Return new access token dan refresh token
    return res.status(200).json({
      token: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresIn: data.session.expires_in || 3600,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
