'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import React from 'react';

export default function AdminBlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        published: 'false' // Show both published and unpublished in admin
      });

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();
      
      setBlogs(data.blogs);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Blog deleted successfully!');
        fetchBlogs();
      } else {
        alert('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayDate = (blog) => {
    if (blog.published && blog.publishedAt) {
      return formatDate(blog.publishedAt);
    } else if (blog.createdAt) {
      return `Created: ${formatDate(blog.createdAt)}`;
    } else if (blog.updatedAt) {
      return `Updated: ${formatDate(blog.updatedAt)}`;
    }
    return 'No date';
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <Link
          href="/admin/blog/add"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add New Blog
        </Link>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {blogs.map((blog) => (
              <tr key={blog._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap max-w-xs overflow-hidden text-ellipsis">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {blog.title}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    /{blog.slug}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                  {blog.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap truncate">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    blog.published 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                  {getDisplayDate(blog)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate">
                  {blog.views || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium max-w-[180px]">
                  <div className="flex gap-3">
                    <Link
                      href={`/blog/${blog.slug}`}
                      target="_blank"
                      className="text-blue-600 hover:text-blue-900 underline"
                    >
                      View
                    </Link>
                    <Link
                      href={`/admin/blog/edit/${blog.slug}`}
                      className="text-indigo-600 hover:text-indigo-900 underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog.slug)}
                      className="text-red-600 hover:text-red-900 underline"
                      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.total > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => prev - 1)}
            disabled={!pagination.hasPrev}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-4 py-2 text-gray-700">
            Page {pagination.current} of {pagination.total}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={!pagination.hasNext}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {blogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No blog posts found</h3>
          <p className="text-gray-500 mb-4">Get started by creating your first blog post.</p>
          <Link
            href="/admin/blog/add"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add New Blog
          </Link>
        </div>
      )}
    </div>
  );
}
