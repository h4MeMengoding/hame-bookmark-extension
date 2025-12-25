import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { authenticate } from '../../../middleware/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const auth = await authenticate(req, res);
  if (!auth) return;

  const { user } = auth;

  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid category ID' });
  }

  try {
    if (req.method === 'DELETE') {
      // Verify category belongs to user
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({ error: 'Category not found' });
      }

      if (category.userId !== user.id) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // Delete category (bookmarks will have categoryId set to null)
      await prisma.category.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Category deleted successfully' });
    } 
    
    else {
      res.setHeader('Allow', ['DELETE']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Category delete error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
