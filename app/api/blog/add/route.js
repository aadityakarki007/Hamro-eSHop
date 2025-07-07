import { connectDB } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { getAuth } from "@clerk/nextjs/server"; // if using Clerk auth

export async function POST(req) {
  await connectDB();
  const { userId } = getAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const { title, content } = await req.json();
  const excerpt = content.substring(0, 100) + "...";

  const newBlog = await Blog.create({
    sellerId: userId, // or your seller ID logic
    title,
    content,
    excerpt,
  });

  return new Response(JSON.stringify({ success: true, blog: newBlog }), { status: 201 });
}
