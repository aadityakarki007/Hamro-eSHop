'use client'
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import React from "react";

export default function EditProduct() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronic Devices');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [sellerName, setSellerName] = useState('');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [stock, setStock] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState('');
  const [returnPeriod, setReturnPeriod] = useState('');
  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product data
  useEffect(() => {
    if (productId) {
      axios.get(`/api/product/${productId}`)
        .then(res => {
          const p = res.data.product;
          setName(p.name || '');
          setDescription(p.description || '');
          setCategory(p.category || 'Electronic Devices');
          setPrice(p.price?.toString() || '');
          setOfferPrice(p.offerPrice?.toString() || '');
          setShippingFee(p.shippingFee?.toString() || '0');
          setDeliveryCharge(p.deliveryCharge?.toString() || '0');
          setSellerName(p.sellerName || '');
          setBrand(p.brand || '');
          setColor(p.color || '');
          setIsPopular(p.isPopular || false);
          setDeliveryDate(p.deliveryDate || '');
          setStock(p.stock?.toString() || '');
          setWarrantyDuration(p.warrantyDuration || '');
          setReturnPeriod(p.returnPeriod || '');
          setExistingImages(p.images || []);
          setLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load product");
          setLoading(false);
        });
    }
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('price', price);
      formData.append('offerPrice', offerPrice);
      formData.append('shippingFee', shippingFee);
      formData.append('deliveryCharge', deliveryCharge);
      formData.append('sellerName', sellerName);
      formData.append('brand', brand || '');
      formData.append('color', color || '');
      formData.append('isPopular', isPopular ? "true" : "false");
      formData.append('deliveryDate', deliveryDate || '');
      formData.append('stock', stock || '0');
      formData.append('warrantyDuration', warrantyDuration || '');
      formData.append('returnPeriod', returnPeriod || '');

      // Only append new files, not existing images
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const token = await getToken();
      const { data } = await axios.put(`/api/product/${productId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success("Product updated!");
        router.push("/seller/product-list");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-8">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Edit Product</h1>
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
            Update Details
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <p className="text-base font-semibold text-gray-700 mb-2">Product Images</p>
            <div className="flex flex-wrap items-center gap-4">
              {/* Show existing images */}
              {existingImages.map((img, idx) => (
                <Image
                  key={img}
                  className="rounded-lg border border-gray-200 shadow-sm object-cover"
                  src={img}
                  alt={`Product image ${idx + 1}`}
                  width={90}
                  height={90}
                />
              ))}
              {/* Upload new images */}
              {[...Array(4 - existingImages.length)].map((_, index) => (
                <label
                  key={index}
                  htmlFor={`image${index}`}
                  className="cursor-pointer flex flex-col items-center justify-center w-[90px] h-[90px] border-2 border-dashed border-blue-300 rounded-lg bg-blue-50 hover:bg-blue-100 transition"
                >
                  <input
                    onChange={(e) => {
                      const updatedFiles = [...files];
                      updatedFiles[index] = e.target.files[0];
                      setFiles(updatedFiles);
                    }}
                    type="file"
                    id={`image${index}`}
                    hidden
                  />
                  <Image
                    className="rounded-lg"
                    src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <span className="text-xs text-blue-400 mt-1">Upload</span>
                </label>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              >
                <option value="Motors, Tools & DIY">Motors, Tools & DIY</option>
              <option value="Home & Lifestyle">Home & Lifestyle</option>
              <option value="Sports & Outdoor">Sports & Outdoor</option>
              <option value="Vapes & Drinks">Vapes & Drinks</option>
              <option value="Electronic & Accessories">Electronic & Accessories</option>
              <option value="Mobiles & Laptops">Mobiles & Laptops</option>
              <option value="Groceries & Pets">Groceries & Pets</option>
              <option value="Men's Fashion">Men's Fashion</option>
              <option value="Watches & Accessories">Watches & Accessories</option>
              <option value="Women's Fashion">Women's Fashion</option>
              <option value="Health & Beauty">Health & Beauty</option>
              <option value="Babies & Toys">Babies & Toys</option>
              <option value="Clothing Accessories">Clothing Accessories</option>
              <option value="Sports & Outdoor Play">Sports & Outdoor Play</option>
              <option value="Gifts & Decorations">Gifts & Decorations</option>
              <option value="Nursery">Nursery</option>
              <option value="Gaming Accessories">Gaming Accessories</option>
              <option value="Diapering & Potty">Diapering & Potty</option>
              <option value="Pacifiers & Accessories">Pacifiers & Accessories</option>
              <option value="Feeding">Feeding</option>
              <option value="Remote Control & Vehicles">Remote Control & Vehicles</option>      
              <option value="Toys & Games">Toys & Games</option>             
              <option value="Soaps, Cleansers & Bodywash">Soaps, Cleansers & Bodywash</option>             
              <option value="Bathing Tubs & Seats">Bathing Tubs & Seats</option>
              <option value="Cosmetics & Skin Care">Cosmetics & Skin Care</option>
              <option value="Exercise & Fitness">Exercise & Fitness</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Price</label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Fee</label>
              <input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Charge</label>
              <input
                type="number"
                value={deliveryCharge}
                onChange={(e) => setDeliveryCharge(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Seller Name</label>
              <input
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Warranty Duration</label>
              <input
                type="text"
                value={warrantyDuration}
                onChange={(e) => setWarrantyDuration(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Period</label>
              <input
                type="text"
                value={returnPeriod}
                onChange={(e) => setReturnPeriod(e.target.value)}
                className="w-full p-2.5 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="accent-blue-600 w-5 h-5"
              id="isPopular"
            />
            <label htmlFor="isPopular" className="text-sm font-medium text-blue-700">Mark as popular</label>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}