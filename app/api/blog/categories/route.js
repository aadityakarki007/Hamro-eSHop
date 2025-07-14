import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/dbConnect';
import Blog from '@/models/Blog';

// GET all categories with post counts
export async function GET() {
  try {
    await dbConnect();
    
    const categories = await Blog.aggregate([
      {
        $match: {
          status: 'published',
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    return NextResponse.json({ categories });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}