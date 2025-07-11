'use client'
import React, { useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";
import { ListFilter, X, Plus } from "lucide-react";

const AddProduct = () => {
  const { getToken } = useAppContext();

  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Electronic & Accessories');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [sellerName, setSellerName] = useState('');
  const [brand, setBrand] = useState('');
  const [colorList, setColorList] = useState([]);
  const [newColor, setNewColor] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [stock, setStock] = useState('');
  const [warrantyDuration, setWarrantyDuration] = useState('');
  const [returnPeriod, setReturnPeriod] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Category-specific attributes
  const [flavourList, setFlavourList] = useState([]);
  const [newFlavour, setNewFlavour] = useState('');
  const [sizeList, setSizeList] = useState([]);
  const [newSize, setNewSize] = useState('');
  const [shoeNumberList, setShoeNumberList] = useState([]);
  const [newShoeNumber, setNewShoeNumber] = useState('');

  // Predefined options for different categories
  const commonSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const commonColors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'Gray', 'Brown', 'Navy', 'Maroon', 'Olive', 'Cyan', 'Magenta'];
  const commonFlavours = ['Strawberry', 'Vanilla', 'Mint', 'Apple', 'Grape', 'Watermelon', 'Mango', 'Cherry', 'Banana', 'Coconut', 'Lemon', 'Orange', 'Peach', 'Blueberry'];
  const commonShoeNumbers = ['6', '6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12', '12.5', '13'];

  // Helper functions for managing lists
  const addToList = (item, list, setList, setNew) => {
    if (item.trim() && !list.includes(item.trim())) {
      setList([...list, item.trim()]);
      setNew('');
    }
  };

  const removeFromList = (item, list, setList) => {
    setList(list.filter(i => i !== item));
  };

  const addPredefinedItem = (item, list, setList) => {
    if (!list.includes(item)) {
      setList([...list, item]);
    }
  };

  // Function to get category-specific attributes
  const getCategorySpecificField = () => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('vape')) {
      return (
        <div className="flex flex-col gap-3 w-full">
          <label className="text-base font-medium">
            Available Flavours
          </label>
          
          {/* Predefined flavours */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm text-gray-600 mr-2">Quick add:</span>
            {commonFlavours.map((flavour) => (
              <button
                key={flavour}
                type="button"
                onClick={() => addPredefinedItem(flavour, flavourList, setFlavourList)}
                className="px-2 py-1 text-xs border border-purple-300 rounded-full hover:bg-purple-50 transition-colors"
                disabled={flavourList.includes(flavour)}
              >
                {flavour}
              </button>
            ))}
          </div>

          {/* Custom flavour input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom flavour"
              className="flex-1 outline-none py-2 px-3 rounded border border-gray-500/40"
              value={newFlavour}
              onChange={(e) => setNewFlavour(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newFlavour, flavourList, setFlavourList, setNewFlavour))}
            />
            <button
              type="button"
              onClick={() => addToList(newFlavour, flavourList, setFlavourList, setNewFlavour)}
              className="px-3 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {/* Selected flavours */}
          <div className="flex flex-wrap gap-2">
            {flavourList.map((flavour, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium border bg-purple-100 text-purple-800 border-purple-300 flex items-center gap-1"
              >
                {flavour}
                <button
                  type="button"
                  onClick={() => removeFromList(flavour, flavourList, setFlavourList)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    if (categoryLower.includes('fashion') || categoryLower.includes('clothing')) {
      return (
        <div className="flex flex-col gap-3 w-full">
          <label className="text-base font-medium">
            Available Sizes
          </label>
          
          {/* Predefined sizes */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm text-gray-600 mr-2">Quick add:</span>
            {commonSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => addPredefinedItem(size, sizeList, setSizeList)}
                className="px-2 py-1 text-xs border border-blue-300 rounded-full hover:bg-blue-50 transition-colors"
                disabled={sizeList.includes(size)}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Custom size input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom size"
              className="flex-1 outline-none py-2 px-3 rounded border border-gray-500/40"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newSize, sizeList, setSizeList, setNewSize))}
            />
            <button
              type="button"
              onClick={() => addToList(newSize, sizeList, setSizeList, setNewSize)}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {/* Selected sizes */}
          <div className="flex flex-wrap gap-2">
            {sizeList.map((size, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium border bg-blue-100 text-blue-800 border-blue-300 flex items-center gap-1"
              >
                {size}
                <button
                  type="button"
                  onClick={() => removeFromList(size, sizeList, setSizeList)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    if (categoryLower.includes('shoes') || categoryLower.includes('footwear')) {
      return (
        <div className="flex flex-col gap-3 w-full">
          <label className="text-base font-medium">
            Available Shoe Numbers
          </label>
          
          {/* Predefined shoe numbers */}
          <div className="flex flex-wrap gap-2 mb-2">
            <span className="text-sm text-gray-600 mr-2">Quick add:</span>
            {commonShoeNumbers.map((number) => (
              <button
                key={number}
                type="button"
                onClick={() => addPredefinedItem(number, shoeNumberList, setShoeNumberList)}
                className="px-2 py-1 text-xs border border-green-300 rounded-full hover:bg-green-50 transition-colors"
                disabled={shoeNumberList.includes(number)}
              >
                {number}
              </button>
            ))}
          </div>

          {/* Custom shoe number input */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add custom shoe number"
              className="flex-1 outline-none py-2 px-3 rounded border border-gray-500/40"
              value={newShoeNumber}
              onChange={(e) => setNewShoeNumber(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newShoeNumber, shoeNumberList, setShoeNumberList, setNewShoeNumber))}
            />
            <button
              type="button"
              onClick={() => addToList(newShoeNumber, shoeNumberList, setShoeNumberList, setNewShoeNumber)}
              className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {/* Selected shoe numbers */}
          <div className="flex flex-wrap gap-2">
            {shoeNumberList.map((number, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full text-sm font-medium border bg-green-100 text-green-800 border-green-300 flex items-center gap-1"
              >
                {number}
                <button
                  type="button"
                  onClick={() => removeFromList(number, shoeNumberList, setShoeNumberList)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      );
    }
    
    return null;
  };

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
      formData.append('color', colorList.join(', '));
      formData.append('isPopular', isPopular ? "true" : "false");
      formData.append('deliveryDate', deliveryDate || '');
      formData.append('stock', stock || '0');
      formData.append('warrantyDuration', warrantyDuration || '');
      formData.append('returnPeriod', returnPeriod || '');

      // Add category-specific attributes
      if (category.toLowerCase().includes('vape')) {
        formData.append('flavours', flavourList.join(', '));
      } else if (category.toLowerCase().includes('fashion') || category.toLowerCase().includes('clothing')) {
        formData.append('sizes', sizeList.join(', '));
      } else if (category.toLowerCase().includes('shoes') || category.toLowerCase().includes('footwear')) {
        formData.append('shoeNumbers', shoeNumberList.join(', '));
      }

      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const token = await getToken();
      const { data } = await axios.post('/api/product/add', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        toast.success(data.message);
        // Reset form
        setFiles([]);
        setName('');
        setDescription('');
        setCategory('Electronic & Accessories');
        setPrice('');
        setOfferPrice('');
        setShippingFee('0');
        setDeliveryCharge('0');
        setSellerName('');
        setBrand('');
        setColorList([]);
        setNewColor('');
        setIsPopular(false);
        setDeliveryDate('');
        setStock('');
        setWarrantyDuration('');
        setReturnPeriod('');
        setFlavourList([]);
        setNewFlavour('');
        setSizeList([]);
        setNewSize('');
        setShoeNumberList([]);
        setNewShoeNumber('');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    // Reset category-specific fields when category changes
    setFlavourList([]);
    setNewFlavour('');
    setSizeList([]);
    setNewSize('');
    setShoeNumberList([]);
    setNewShoeNumber('');
  };

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <div className="p-4 flex justify-between items-center border-b bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
        <Link href="/seller/product-list" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          <ListFilter size={18} className="mr-2" />
          Manage Products
        </Link>
      </div>
      
      <div className="flex-1 bg-gray-50 p-4 md:p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-6">
          
          {/* Product Images */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Product Images</h2>
            <div className="flex flex-wrap items-center gap-4">
              {[...Array(4)].map((_, index) => (
                <label key={index} htmlFor={`image${index}`} className="cursor-pointer">
                  <input onChange={(e) => {
                    const updatedFiles = [...files];
                    updatedFiles[index] = e.target.files[0];
                    setFiles(updatedFiles);
                  }} type="file" id={`image${index}`} hidden accept="image/*" />
                  <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 transition-colors">
                    <Image
                      className="w-full h-full object-cover rounded-lg"
                      src={files[index] ? URL.createObjectURL(files[index]) : assets.upload_area}
                      alt=""
                      width={96}
                      height={96}
                    />
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Upload up to 4 images. First image will be the main product image.</p>
          </div>

          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-name">
                  Product Name *
                </label>
                <input
                  id="product-name"
                  type="text"
                  placeholder="Enter product name"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-description">
                  Product Description *
                </label>
                <textarea
                  id="product-description"
                  rows={4}
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder="Describe your product in detail"
                  onChange={(e) => setDescription(e.target.value)}
                  value={description}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                  Category *
                </label>
                <select
                  id="category"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={handleCategoryChange}
                  value={category}
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
                  <option value="Shoes & Footwear">Shoes & Footwear</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="brand">
                  Brand *
                </label>
                <input
                  id="brand"
                  type="text"
                  placeholder="Enter brand name"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setBrand(e.target.value)}
                  value={brand}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <input
                    id="isPopular"
                    type="checkbox"
                    checked={isPopular}
                    onChange={e => setIsPopular(e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isPopular" className="text-sm font-medium text-gray-700">
                    Mark as Popular Product
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Pricing & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="product-price">
                  Product Price *
                </label>
                <input
                  id="product-price"
                  type="number"
                  placeholder="0"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="offer-price">
                  Offer Price *
                </label>
                <input
                  id="offer-price"
                  type="number"
                  placeholder="0"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setOfferPrice(e.target.value)}
                  value={offerPrice}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="shipping-fee">
                  Shipping Fee
                </label>
                <input
                  id="shipping-fee"
                  type="number"
                  placeholder="0"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setShippingFee(e.target.value)}
                  value={shippingFee}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="delivery-charge">
                  Delivery Charge
                </label>
                <input
                  id="delivery-charge"
                  type="number"
                  placeholder="0"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setDeliveryCharge(e.target.value)}
                  value={deliveryCharge}
                />
              </div>
            </div>
          </div>

          {/* Seller Information */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Seller Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="seller-name">
                  Seller Name *
                </label>
                <input
                  id="seller-name"
                  type="text"
                  placeholder="Enter your store or business name"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setSellerName(e.target.value)}
                  value={sellerName}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="stock">
                  Available Stock *
                </label>
                <input
                  id="stock"
                  type="number"
                  min="0"
                  placeholder="Number of items in stock"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setStock(e.target.value)}
                  value={stock}
                  required
                />
              </div>
            </div>
          </div>

          {/* Colors */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Available Colors</h2>
            
            {/* Predefined colors */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Quick add colors:</label>
              <div className="flex flex-wrap gap-2">
                {commonColors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => addPredefinedItem(color, colorList, setColorList)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors flex items-center gap-2"
                    disabled={colorList.includes(color)}
                  >
                    <div 
                      className="w-4 h-4 rounded-full border"
                      style={{ backgroundColor: color.toLowerCase() }}
                    />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom color input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Add custom color"
                className="flex-1 outline-none py-2 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addToList(newColor, colorList, setColorList, setNewColor))}
              />
              <button
                type="button"
                onClick={() => addToList(newColor, colorList, setColorList, setNewColor)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            
            {/* Selected colors */}
            <div className="flex flex-wrap gap-2">
              {colorList.map((color, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full text-sm font-medium border bg-gray-100 text-gray-800 border-gray-300 flex items-center gap-2"
                >
                  <div 
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.toLowerCase() }}
                  />
                  {color}
                  <button
                    type="button"
                    onClick={() => removeFromList(color, colorList, setColorList)}
                    className="ml-1 text-gray-600 hover:text-gray-800"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Category-specific fields */}
          {getCategorySpecificField() && (
            <div className="border-b pb-6">
              <h2 className="text-lg font-semibold mb-4">Category-Specific Options</h2>
              {getCategorySpecificField()}
            </div>
          )}

          {/* Product Details */}
          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Product Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="delivery-date">
                  Delivery Date
                </label>
                <input
                  id="delivery-date"
                  type="text"
                  placeholder="e.g. 7-10 days, 2 weeks"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  value={deliveryDate}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="warranty">
                  Warranty Duration
                </label>
                <input
                  id="warranty"
                  type="text"
                  placeholder="e.g. 1 year, 6 months"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setWarrantyDuration(e.target.value)}
                  value={warrantyDuration}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="return">
                  Return Period
                </label>
                <input
                  id="return"
                  type="text"
                  placeholder="e.g. 7 days, 30 days"
                  className="w-full outline-none py-2.5 px-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setReturnPeriod(e.target.value)}
                  value={returnPeriod}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adding Product...
                </span>
              ) : (
                'Add Product'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;