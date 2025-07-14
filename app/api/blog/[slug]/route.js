import dbConnect from '@/lib/dbConnect';
import Blog from '@/models/Blog';
import { NextResponse } from 'next/server';

// GET single blog by slug
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { slug } = await params;
    const blog = await Blog.findOne({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Increment view count
    blog.views += 1;
    await blog.save();
    
    return NextResponse.json(blog);
    
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

// PUT update blog
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    
    const { slug } = await params;
    const data = await request.json();
    
    const blog = await Blog.findOneAndUpdate(
      { slug },
      data,
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Blog updated successfully',
      blog
    });
    
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

// DELETE blog
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    
    const { slug } = await params;
    const blog = await Blog.findOneAndDelete({ slug });
    
    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Blog deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}