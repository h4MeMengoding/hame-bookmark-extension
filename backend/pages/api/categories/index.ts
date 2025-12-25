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

  try {
    if (req.method === 'GET') {
      // Get all categories for user
      const categories = await prisma.category.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'asc' },
      });
      
      return res.status(200).json({ categories });
    } 
    
    else if (req.method === 'POST') {
      // Create new category
      const { name, color } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      // Check if category already exists
      const existing = await prisma.category.findUnique({
        where: {
          userId_name: {
            userId: user.id,
            name: name.trim(),
          },
        },
      });

      if (existing) {
        return res.status(400).json({ error: 'Category already exists' });
      }

      const category = await prisma.category.create({
        data: {
          name: name.trim(),
          color: color || 'neo-blue',
          userId: user.id,
        },
      });

      return res.status(201).json({ category });
    } 
    
    else {
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }
  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
