import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from 'axios';

const HomeProducts = () => {
  const { router } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/product/list', {
          params: { limit: 10 }
        });
        if (data.success) {
          setProducts(data.products);
        } else {
          setError(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        setError(error.message || 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <Loading />;
  if (error || !products.length) return null;

  // Ensure only 10 products are shown
  const displayProducts = products.slice(0, 10);

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular Products</p>
      {/* Mobile grid: custom card style */}
      <div className="w-full">
        <div className="grid grid-cols-2 gap-2 md:hidden pb-14 mt-6">
          {displayProducts.map((product, index) => {
            const price = product.offerPrice || product.price;
            const hasDiscount = product.price && product.offerPrice && product.price > product.offerPrice;
            const discount = hasDiscount
              ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
              : 0;
            return (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden cursor-pointer"
                onClick={() => router.push(`/product/${product._id}`)}
              >
                {/* Square Product Image */}
                <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
                  <img
                    src={product.images?.[0] || '/placeholder-image.jpg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Product Info */}
                <div className="p-2">
                  <h3 className="text-xs font-medium text-gray-900 line-clamp-2 mb-1 h-8">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-x-4 mb-1">
                    <span className="text-base font-bold text-orange-600">
                      Rs. {price}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="text-xs text-gray-500 line-through">
                          Rs. {product.price}
                        </span>
                        <span className="text-xs text-green-600 font-semibold ml-2">
                          -{discount}%
                        </span>
                      </>
                    )}
                  </div>
                  {/* Category */}
                  <div className="text-xs text-gray-500 mb-1">{product.category}</div>
                  {/* Ratings */}
                  {product.rating && (
                    <div className="flex items-center gap-1 text-xs text-yellow-600 mb-1">
                      <span>★</span>
                      <span>{product.rating}</span>
                    </div>
                  )}
                  {/* Sold Count */}
                  {product.soldCount && (
                    <div className="text-xs text-gray-400">{product.soldCount} sold</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Desktop grid: keep ProductCard */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
