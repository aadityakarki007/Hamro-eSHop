export async function getProductsByCategory(category) {
    try {
        await connectDB();
        
        const products = await Product.find({ category }).lean();
        
        // You can add additional processing here based on category
        return products.map(product => ({
            ...product,
            // Add computed fields or format category-specific data
            categoryData: product.categorySpecific || {}
        }));
        
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}