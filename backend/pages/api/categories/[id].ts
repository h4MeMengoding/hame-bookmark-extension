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

    // Update category
    if (req.method === 'PUT') {
      const { name, color } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      // Validate color (reuse same validation as index.ts)
      const allowedTokens = ['neo-blue','neo-pink','neo-green','neo-yellow','neo-purple','neo-orange'];
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
      let validatedColor = 'neo-blue';
      if (typeof color === 'string') {
        let c = color.trim();
        if (hexRegex.test(c)) {
          if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
          validatedColor = c.toLowerCase();
        } else if (allowedTokens.includes(c)) {
          validatedColor = c;
        }
      }

      // Ensure category exists and belongs to user
      const existing = await prisma.category.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: 'Category not found' });
      if (existing.userId !== user.id) return res.status(403).json({ error: 'Forbidden' });

      // Check uniqueness of name for this user (excluding current id)
      const duplicate = await prisma.category.findFirst({
        where: { userId: user.id, name: name.trim(), NOT: { id } }
      });
      if (duplicate) return res.status(400).json({ error: 'Category name already used' });

      const updated = await prisma.category.update({
        where: { id },
        data: { name: name.trim(), color: validatedColor },
      });

      return res.status(200).json({ category: updated });
    }

    else {
      res.setHeader('Allow', ['DELETE','PUT']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Category delete error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
