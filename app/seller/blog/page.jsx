'use client';
import React, { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useAppContext } from "@/context/AppContext";

export default function SellerBlogList() {
  const { getToken } = useAppContext();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const token = await getToken();
      const { data } = await axios.get('/api/blog/seller', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBlogs(data.blogs || []);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">Your Blogs</h1>
        <Link href="/seller/blog/add" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Add New Blog
        </Link>
      </div>
      {blogs.length === 0 ? (
        <p>No blogs yet.</p>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog._id} className="border p-4 rounded shadow">
              <h2 className="text-lg font-bold">{blog.title}</h2>
              <p className="text-gray-700">{blog.excerpt}</p>
              <Link href={`/seller/blog/${blog._id}/edit`} className="text-blue-600 underline">
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
