'use client';
import React, { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function EditBlogPage() {
  const { getToken } = useAppContext();
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      const token = await getToken();
      const { data } = await axios.get(`/api/blog/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTitle(data.blog.title);
      setContent(data.blog.content);
    };
    fetchBlog();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = await getToken();
      const { data } = await axios.put(`/api/blog/${params.id}`, { title, content }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Blog updated!");
        router.push('/seller/blog');
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Edit Blog</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" className="border p-2 w-full rounded"
            value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <textarea rows="8" className="border p-2 w-full rounded"
            value={content} onChange={(e) => setContent(e.target.value)} required />
        </div>
        <button type="submit" disabled={isSubmitting}
          className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
          {isSubmitting ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
}
