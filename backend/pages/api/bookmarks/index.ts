import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authenticate } from '../../../middleware/auth';

type BookmarksResponse = {
  bookmarks: Array<{
    id: string;
    title: string;
    url: string;
    createdAt: string;
  }>;
} | {
  bookmark: {
    id: string;
    title: string;
    url: string;
    createdAt: string;
  };
} | {
  error: string;
};

/**
 * GET /api/bookmarks - Get all user's bookmarks
 * POST /api/bookmarks - Create new bookmark
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookmarksResponse>
) {
  // Authenticate user
  const auth = await authenticate(req, res);
  if (!auth) return;

  const { user } = auth;

  try {
    // GET - Fetch all bookmarks
    if (req.method === 'GET') {
      const bookmarks = await prisma.bookmark.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          url: true,
          categoryId: true,
          tags: true,
          clickCount: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });

      return res.status(200).json({
        bookmarks: bookmarks.map(b => ({
          ...b,
          createdAt: b.createdAt.toISOString(),
        })),
      });
    }

    // POST - Create new bookmark
    if (req.method === 'POST') {
      const { title, url, categoryId, tags } = req.body;

      // Validasi input
      if (!title || !url) {
        return res.status(400).json({ error: 'Title and URL are required' });
      }

      // Validasi URL format
      try {
        new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format' });
      }

      // Create bookmark
      const bookmark = await prisma.bookmark.create({
        data: {
          title: title.trim(),
          url: url.trim(),
          userId: user.id,
          categoryId: categoryId || null,
          tags: tags || [],
        },
        select: {
          id: true,
          title: true,
          url: true,
          categoryId: true,
          tags: true,
          clickCount: true,
          createdAt: true,
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
        },
      });

      return res.status(201).json({
        bookmark: {
          ...bookmark,
          createdAt: bookmark.createdAt.toISOString(),
        },
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Bookmarks API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
