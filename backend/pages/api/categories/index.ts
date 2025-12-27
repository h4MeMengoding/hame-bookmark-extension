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
      let { name, color } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({ error: 'Category name is required' });
      }

      name = name.trim();

      // Validate color: accept hex (#rrggbb or #rgb) or allowed token names
      const allowedTokens = ['neo-blue','neo-pink','neo-green','neo-yellow','neo-purple','neo-orange'];
      const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

      if (typeof color === 'string') {
        color = color.trim();
        if (hexRegex.test(color)) {
          // normalize hex to lowercase full 6-char (#rrggbb)
          if (color.length === 4) {
            // Expand #rgb -> #rrggbb
            color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
          }
          color = color.toLowerCase();
        } else if (!allowedTokens.includes(color)) {
          // Unknown format -> fallback
          color = 'neo-blue';
        }
      } else {
        color = 'neo-blue';
      }

      // Check if category already exists
      const existing = await prisma.category.findUnique({
        where: {
          userId_name: {
            userId: user.id,
            name,
          },
        },
      });

      if (existing) {
        return res.status(400).json({ error: 'Category already exists' });
      }

      const category = await prisma.category.create({
        data: {
          name,
          color,
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
