// components/admin/PopularProductsManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PopularProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchPopularProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/list');
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchPopularProducts = async () => {
    try {
      const { data } = await axios.get('/api/product/popular');
      setPopularProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching popular products:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePopularProduct = async (productId) => {
    try {
      const isPopular = popularProducts.some(p => p._id === productId);
      
      if (isPopular) {
        // Remove from popular
        await axios.delete(`/api/admin/popular-products/${productId}`);
      } else {
        // Add to popular
        await axios.post('/api/admin/popular-products', { productId });
      }
      
      // Refresh the popular products list
      fetchPopularProducts();
    } catch (error) {
      console.error('Error toggling popular product:', error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Popular Products</h1>
      
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Popular Products Count */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800">
          <strong>{popularProducts.length}</strong> products are currently marked as popular
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const isPopular = popularProducts.some(p => p._id === product._id);
          
          return (
            <div
              key={product._id}
              className={`border rounded-lg p-4 transition-all ${
                isPopular 
                  ? 'border-orange-500 bg-orange-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Product Image */}
              <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images?.[0] || '/placeholder-image.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 capitalize">
                {product.category}
              </p>
              <p className="text-sm font-bold text-orange-600 mb-3">
                Rs. {(product.offerPrice || product.price)?.toLocaleString()}
              </p>

              {/* Toggle Button */}
              <button
                onClick={() => togglePopularProduct(product._id)}
                className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  isPopular
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {isPopular ? '★ Remove from Popular' : '☆ Mark as Popular'}
              </button>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products found matching your search.
        </div>
      )}
    </div>
  );
};

export default PopularProductsManager;