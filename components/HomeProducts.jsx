import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Loading";
import axios from 'axios';

const HomeProducts = () => {
  const { router } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const { data } = await axios.get('/api/product/popular');
        if (data.success) {
          setPopularProducts(data.products);
        }
      } catch (error) {
        console.error('Error fetching popular products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  if (loading) return <Loading />;

  // Only render if there are popular products
  if (!popularProducts?.length) {
    return null;
  }

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {popularProducts.map((product, index) => (
          <ProductCard key={product._id || index} product={product} />
        ))}
      </div>
      <button 
        onClick={() => router.push('/all-products')} 
        className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition"
      >
        See more
      </button>
    </div>
  );
};

export default HomeProducts;