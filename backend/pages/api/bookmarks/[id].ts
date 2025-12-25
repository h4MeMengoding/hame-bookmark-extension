import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authenticate } from '../../../middleware/auth';

type ApiResponse = {
  message?: string;
  bookmark?: any;
  error?: string;
};

/**
 * PUT /api/bookmarks/[id] - Update a bookmark
 * DELETE /api/bookmarks/[id] - Delete a bookmark
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Authenticate user
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { user } = auth;
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid bookmark ID' });
  }

  try {
    // PUT - Update bookmark
    if (req.method === 'PUT') {
      const { title, url, categoryId, tags, iconUrl } = req.body;

      console.log('UPDATE bookmark request:', { id, title, url, categoryId, tags, iconUrl, userId: user.id });

      // Validasi input
      if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
      }

      // Cek apakah bookmark milik user
      const existingBookmark = await prisma.bookmark.findFirst({
        where: {
          id,
          userId: user.id,
        },
      });

      if (!existingBookmark) {
        console.log('Bookmark not found:', { id, userId: user.id });
        return res.status(404).json({ error: 'Bookmark not found' });
      }

      console.log('Existing bookmark:', existingBookmark);

      // Update bookmark
      const updatedBookmark = await prisma.bookmark.update({
        where: { id },
        data: {
          title,
          url,
          iconUrl: iconUrl?.trim() || null,
          categoryId: categoryId || null,
          tags: tags !== undefined ? tags : existingBookmark.tags,
        },
      });

      console.log('Updated bookmark:', updatedBookmark);

      return res.status(200).json({ 
        message: 'Bookmark updated successfully',
        bookmark: updatedBookmark 
      });
    }

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
    console.error('Bookmark API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
