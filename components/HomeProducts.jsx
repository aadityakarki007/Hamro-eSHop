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
  const [imageLoadErrors, setImageLoadErrors] = useState({});

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

  const handleImageError = (productId) => {
    setImageLoadErrors(prev => ({ ...prev, [productId]: true }));
  };

  const handleProductClick = (productId, productName) => {
    // SEO-friendly URL with product name slug
    const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    router.push(`/product/${productId}/${slug}`);
  };

  if (loading) return <Loading />;
  if (error || !products.length) return null;

  // Ensure only 10 products are shown
  const displayProducts = products.slice(0, 10);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-500">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-500">☆</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">☆</span>);
      }
    }
    return stars;
  };

  // Product card component to avoid duplication
  const ProductCardComponent = ({ product, index }) => {
    const price = product.offerPrice || product.price;
    const hasDiscount = product.price && product.offerPrice && product.price > product.offerPrice;
    const discount = hasDiscount
      ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
      : 0;
    
    return (
      <article
        key={product._id}
        className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 hover:border-gray-300"
        onClick={() => handleProductClick(product._id, product.name)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${product.name}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleProductClick(product._id, product.name);
          }
        }}
      >
        {/* Product Image Container */}
        <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
              -{discount}%
            </div>
          )}
          
          {/* Product Image */}
          <img
            src={imageLoadErrors[product._id] ? '/placeholder-image.jpg' : (product.images?.[0] || '/placeholder-image.jpg')}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading={index < 4 ? "eager" : "lazy"}
            onError={() => handleImageError(product._id)}
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
        </div>

        {/* Product Info */}
        <div className="p-3 sm:p-4 lg:p-4 space-y-2">
          {/* Product Name */}
          <h3 className="text-xs sm:text-sm lg:text-sm font-semibold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] sm:min-h-[2.8rem]">
            {product.name}
          </h3>

          {/* Category */}
          <p className="text-xs text-gray-500 capitalize">
            {product.category}
          </p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 text-xs">
              <div className="flex">
                {renderStars(product.rating)}
              </div>
              <span className="text-gray-600 ml-1">
                ({product.rating})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-start sm:gap-2 lg:gap-0 space-y-1 sm:space-y-0 lg:space-y-1">
            <span className="text-sm sm:text-base lg:text-base font-bold text-orange-600">
              Rs. {price?.toLocaleString()}
            </span>
            {hasDiscount && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 line-through">
                  Rs. {product.price?.toLocaleString()}
                </span>
                <span className="text-xs text-green-600 font-semibold">
                  Save Rs. {(product.price - product.offerPrice)?.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
            {product.soldCount && (
              <span>{product.soldCount} sold</span>
            )}
            {product.inStock !== undefined && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-0 sm:px-6 lg:px-8" aria-labelledby="popular-products-heading">
      <div className="flex flex-col items-center pt-8 sm:pt-12 lg:pt-16">
        {/* Enhanced Header */}
        <div className="w-full text-center mb-8 sm:mb-12">
          <h2 id="popular-products-heading" className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Popular Products
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Discover our best-selling items loved by thousands of customers
          </p>
        </div>

        {/* Responsive Product Grid */}
        <div className="w-full">
          {/* Mobile and Tablet - 2-3 columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 pb-8 sm:pb-12 lg:hidden">
            {displayProducts.map((product, index) => (
              <ProductCardComponent key={product._id} product={product} index={index} />
            ))}
          </div>

          {/* Desktop - 5 columns */}
          <div className="hidden lg:grid grid-cols-5 gap-6 pb-12 lg:pb-16">
            {displayProducts.map((product, index) => (
              <ProductCardComponent key={product._id} product={product} index={index} />
            ))}
          </div>

          {/* Enhanced CTA Button */}
          <div className="text-center">
            <button 
              onClick={() => router.push('/all-products')} 
              className="group relative px-8 sm:px-12 py-3 sm:py-4 bg-white border-2 border-gray-300 rounded-full text-gray-700 font-medium text-sm sm:text-base hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              aria-label="View all products"
            >
              <span className="flex items-center gap-2">
                See All Products
                <svg 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProducts;