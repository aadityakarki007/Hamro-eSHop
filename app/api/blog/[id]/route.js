import { connectDB } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req, { params }) {
  await connectDB();
  const blog = await Blog.findById(params.id);
  if (!blog) {
    return new Response(JSON.stringify({ success: false, message: "Not found" }), { status: 404 });
  }
  return new Response(JSON.stringify({ success: true, blog }), { status: 200 });
}

export async function PUT(req, { params }) {
  await connectDB();
  const { userId } = getAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const { title, content } = await req.json();
  const updated = await Blog.findOneAndUpdate(
    { _id: params.id, sellerId: userId },
    { title, content, excerpt: content.substring(0, 100) + "...", updatedAt: new Date() },
    { new: true }
  );

  if (!updated) {
    return new Response(JSON.stringify({ success: false, message: "Update failed" }), { status: 404 });
  }

  return new Response(JSON.stringify({ success: true, blog: updated }), { status: 200 });
}
