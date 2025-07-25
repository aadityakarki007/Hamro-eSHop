'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import { useSearchParams } from "next/navigation";

const ProductList = () => {

  const { router, getToken, user } = useAppContext()
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchSellerProduct = async () => {
    try {
      const token = await getToken()

      const { data } = await axios.get('/api/product/seller-list',{headers:{Authorization: `Bearer ${token}`}})

      if (data.success){
        setProducts(data.products)
        setLoading(false)
      } else {
        toast.error(data.message)
      }

  } catch(error){
    toast.error(error.message)
  }
}
   
  useEffect(() => {
    if (user){
      fetchSellerProduct()
    }
  }, [])

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/product/${productId}`);
      setProduct(data.product);
    } catch (error) {
      toast.error("Failed to load product");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken()
      const { data } = await axios.delete(`/api/product/${id}`, { headers: { Authorization: `Bearer ${token}` } })

      if (data.success) {
        toast.success(data.message)
        setProducts(products.filter(product => product._id !== id))
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleEdit = (product) => {
    router.push(`/product/edit?id=${product._id}`);
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="flex flex-col items-center max-w-5xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="w-2/3 md:w-2/5 px-4 py-3 font-medium truncate">Product</th>
                <th className="px-4 py-3 font-medium truncate max-sm:hidden">Category</th>
                <th className="px-4 py-3 font-medium truncate">
                  Price
                </th>
                <th className="px-4 py-3 font-medium truncate w-24 md:w-auto">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product, index) => (
                <tr key={index} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <div className="bg-gray-500/10 rounded p-2">
                      <Image
                        src={product.images[0]}
                        alt="product Image"
                        className="w-16"
                        width={1280}
                        height={720}
                      />
                    </div>
                    <span className="w-full break-words">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                  <td className="px-4 py-3">${product.offerPrice}</td>
                  <td className="px-4 py-3 flex flex-col md:flex-row items-stretch md:items-center gap-1 w-24 md:w-auto">
                    <button
                      onClick={() => router.push(`/product/${product._id}`)}
                      className="flex items-center gap-0.5 px-1 py-0.5 md:px-3 md:py-1 bg-orange-600 text-white rounded-md md:w-auto justify-center text-[10px] md:text-sm min-w-0"
                      style={{ minWidth: "auto", width: "auto" }}
                    >
                      Visit
                      <Image className="h-2.5 w-2.5 md:h-4 md:w-4" src={assets.redirect_icon} alt="redirect_icon" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="px-1 py-0.5 md:px-3 md:py-1 bg-red-600 text-white rounded hover:bg-red-700 md:w-auto text-[10px] md:text-sm min-w-0"
                      style={{ minWidth: "auto", width: "auto" }}
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleEdit(product)}
                      className="px-1 py-0.5 md:px-3 md:py-1 bg-blue-600 text-white rounded hover:bg-blue-700 md:w-auto text-[10px] md:text-sm min-w-0"
                      style={{ minWidth: "auto", width: "auto" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          const token = await getToken();
                          const { data } = await axios.put(
                            '/api/product/set-popular',
                            { productId: product._id, isPopular: !product.isPopular },
                            { headers: { Authorization: `Bearer ${token}` } }
                          );
                          if (data.success) {
                            toast.success(data.message || (product.isPopular ? "Removed from popular" : "Marked as popular"));
                            await fetchSellerProduct(); // <-- This will fetch the latest data from the backend
                          } else {
                            toast.error(data.message || "Failed to update popular status");
                          }
                        } catch (error) {
                          toast.error(error.message || "Failed to update popular status");
                        }
                      }}
                      className={`px-1 py-0.5 md:px-3 md:py-1 rounded md:w-auto text-[10px] md:text-sm min-w-0 ${
                        product.isPopular
                          ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
                          : "bg-gray-200 text-gray-700 hover:bg-yellow-200"
                      }`}
                      style={{ minWidth: "auto", width: "auto" }}
                    >
                      {product.isPopular ? "Unmark Popular" : "Mark Popular"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;