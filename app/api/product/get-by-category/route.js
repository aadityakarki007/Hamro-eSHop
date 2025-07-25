import connectDB from '@/lib/dbConnect';
import Product from '@/models/product';  // make sure to import your product model

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    if (!category) {
      return new Response(JSON.stringify({ error: 'Category is required' }), { status: 400 });
    }

    const products = await Product.find({ category }).lean();

    const formattedProducts = products.map(product => ({
      ...product,
      categoryData: product.categorySpecific || {},
    }));

    return new Response(JSON.stringify(formattedProducts), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch products' }), { status: 500 });
  }
}
