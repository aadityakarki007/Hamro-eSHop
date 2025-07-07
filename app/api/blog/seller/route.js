import { connectDB } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  await connectDB();
  const { userId } = getAuth(req);
  if (!userId) {
    return new Response(JSON.stringify({ success: false, message: "Unauthorized" }), { status: 401 });
  }

  const blogs = await Blog.find({ sellerId: userId }).sort({ createdAt: -1 });
  return new Response(JSON.stringify({ success: true, blogs }), { status: 200 });
}
