import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '../lib/supabase';

export interface AuthenticatedRequest extends NextApiRequest {
  user: {
    id: string;
    email: string;
  };
}

/**
 * Middleware untuk authenticate request menggunakan Bearer token
 */
export const authenticate = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<{ user: { id: string; email: string } } | null> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized - No token provided' });
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix

  try {
    // Verify token dengan Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Unauthorized - Invalid token' });
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email!,
      },
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Unauthorized - Token verification failed' });
    return null;
  }
};
