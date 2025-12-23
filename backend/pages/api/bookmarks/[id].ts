import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authenticate } from '../../../middleware/auth';

type DeleteResponse = {
  message: string;
} | {
  error: string;
};

/**
 * DELETE /api/bookmarks/[id] - Delete a bookmark
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteResponse>
) {
  // Authenticate user
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { user } = auth;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid bookmark ID' });
  }

  try {
    // DELETE - Delete bookmark
    if (req.method === 'DELETE') {
      // Cek apakah bookmark milik user
      const bookmark = await prisma.bookmark.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!bookmark) {
        return res.status(404).json({ error: 'Bookmark not found' });
      }

      // Delete bookmark
      await prisma.bookmark.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Bookmark deleted successfully' });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
