import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { authenticate } from '../../../../middleware/auth';

type ApiResponse = {
  message?: string;
  bookmark?: any;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Allow OPTIONS for CORS
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only allow POST for click increment
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const auth = await authenticate(req, res);
  if (!auth) return;

  const { user } = auth;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid bookmark ID' });
  }

  try {
    // Ensure bookmark exists and belongs to user
    const bookmark = await prisma.bookmark.findFirst({ where: { id, userId: user.id } });
    if (!bookmark) return res.status(404).json({ error: 'Bookmark not found' });

    // Increment clickCount atomically; `updatedAt` will be changed by Prisma
    const updated = await prisma.bookmark.update({
      where: { id },
      data: { clickCount: { increment: 1 } },
      select: {
        id: true,
        clickCount: true,
        updatedAt: true,
      },
    });

    return res.status(200).json({ message: 'Click recorded', bookmark: updated });
  } catch (error) {
    console.error('Click API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
