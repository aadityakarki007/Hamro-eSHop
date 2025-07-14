import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

// GET all blogs
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const category = searchParams.get('category');
    const published = searchParams.get('published') !== 'false';
    
    const skip = (page - 1) * limit;
    
    let filter = {};
    if (published) filter.published = true;
    if (category) filter.category = category;
    
    const blogs = await Blog.find(filter)
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Blog.countDocuments(filter);
    
    return NextResponse.json({
      blogs,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

// POST new blog
export async function POST(request) {
  try {
    await dbConnect();
    
    const data = await request.json();
    
    // Generate slug from title if not provided
    let slug = data.slug;
    if (!slug && data.title) {
      slug = data.title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .trim();
    }
    
    // Ensure slug is unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await Blog.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    // Create blog with generated slug
    const blogData = {
  ...data,
  slug: uniqueSlug,
};

// Ensure publishedAt is set if blog is published and no value provided
if (blogData.published && !blogData.publishedAt) {
  blogData.publishedAt = new Date();
}

    
    const blog = new Blog(blogData);
    await blog.save();
    
    return NextResponse.json(
      { message: 'Blog created successfully', blog },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  }
}