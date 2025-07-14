'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import React from 'react';

export default function BlogSinglePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        throw new Error('Blog not found');
      }
      
      const data = await response.json();
      setBlog(data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog not found</h1>
          <Link href="/blog" className="text-blue-600 hover:underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Back to Blog */}
      <div className="mb-6">
        <Link href="/blog" className="text-blue-600 hover:underline flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Blog
        </Link>
      </div>

      {/* Blog Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
            {blog.category}
          </span>
          <span className="text-sm text-gray-500">
            {blog.readTime} min read • {blog.views} views
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        {blog.excerpt && (
          <p className="text-xl text-gray-600 mb-6">
            {blog.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div className="flex items-center space-x-4">
            <div>
              <p className="text-sm font-medium text-gray-900">
                {blog.author}
              </p>
              <p className="text-sm text-gray-500">
                Published on {formatDate(blog.publishedAt)}
              </p>
            </div>
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {blog.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Featured Image */}
      {blog.featuredImage && (
        <div className="mb-8">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg shadow-md"
          />
        </div>
      )}

      {/* Blog Content */}
      <article className="prose prose-lg max-w-none">
        <div className="whitespace-pre-line text-gray-800 leading-relaxed">
          {blog.content}
        </div>
      </article>

      {/* Share and Navigation */}
      <div className="mt-12 pt-8 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Share this article:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('Link copied to clipboard!');
                }}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Copy Link
              </button>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Last updated: {formatDate(blog.updatedAt)}
          </div>
        </div>
      </div>
    </div>
  );
}