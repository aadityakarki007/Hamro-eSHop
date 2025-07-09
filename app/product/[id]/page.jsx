"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppContext } from "@/context/AppContext";
import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import QRCode from "qrcode";

const Product = () => {
    const { id } = useParams();
    const { products, router, user, getToken, cartItems, setCartItems } = useAppContext();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [qrUrl, setQrUrl] = useState('');
    const [selectedColor, setSelectedColor] = useState('');

    const addToCart = async (itemId) => {
  if (!itemId) {
    toast.error('Invalid product ID');
    return;
  }

  let cartData = structuredClone(cartItems);
  if (cartData[itemId]) {
    cartData[itemId].quantity += 1;
  } else {
    cartData[itemId] = { quantity: 1, color: selectedColor || null };
  }
  setCartItems(cartData);
  toast.success('Item added to cart');

  if (user) {
    try {
      const token = await getToken();
      await axios.post('/api/cart/update', { cartData }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Cart update error:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to update cart');
    }
  }
};


    const fetchProductData = async () => {
        if (!products || products.length === 0) return;
        
        const product = products.find(product => product._id === id);
        if (product) {
            setProductData(product);
            // Set main image to first available image if not already set
            if (!mainImage && product.images && product.images.length > 0) {
                setMainImage(product.images[0]);
            }

            // Set selected color to first available color option
            if (product.color) {
                const colorOptions = product.color.split(",").map(clr => clr.trim()).filter(Boolean);
                setSelectedColor(colorOptions[0] || '');
            }
        }
    };

    useEffect(() => {
        fetchProductData();
    }, [id, products]);

    useEffect(() => {
        if (productData?._id) {
            // Generate full URL for QR code
            let qrCodeUrl;
            if (typeof window !== 'undefined') {
                // Browser environment - use current origin + product path
                qrCodeUrl = `${window.location.origin}/product/${productData._id}`;
            } else {
                // Server environment - use relative path (you might want to add your domain here)
                qrCodeUrl = `https://hamroeshop.com/product/${productData._id}`;
            }
            
            QRCode.toDataURL(qrCodeUrl)
                .then(url => setQrUrl(url))
                .catch(err => console.error('QR Code generation error:', err));
        }
    }, [productData?._id]);
    
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!user) {
            toast.error("Please log in to submit a review");
            return;
        }
        
        if (!reviewComment.trim()) {
            toast.error("Please enter a review comment");
            return;
        }
        
        try {
            setSubmittingReview(true);
            const token = await getToken();
            
            const response = await axios.post('/api/product/review', {
                productId: id,
                rating: reviewRating,
                comment: reviewComment.trim(),
                userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Anonymous'
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                toast.success("Review submitted successfully");
                setReviewComment('');
                setReviewRating(5);
                
                // Update the product data with the new review
                const updatedProduct = { ...productData };
                updatedProduct.reviews = [...(updatedProduct.reviews || []), response.data.review];
                updatedProduct.averageRating = updatedProduct.reviews.reduce((sum, review) => sum + review.rating, 0) / updatedProduct.reviews.length;
                setProductData(updatedProduct);
            } else {
                toast.error(response.data.message || "Failed to submit review");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            toast.error(error.response?.data?.message || error.message || "An error occurred");
        } finally {
            setSubmittingReview(false);
        }
    };

    // Show loading if products haven't loaded yet or if specific product not found
    if (!products || products.length === 0 || !productData) {
        return <Loading />;
    }

    // ✅ ProductDetails.jsx — same file or separate if you want

const ProductDetails = React.memo(
  ({
    product,
    colorOptions,
    selectedColor,
    setSelectedColor,
    onAddToCart,
    onBuyNow,
    qrUrl,
    router,
  }) => {
    const discount = React.useMemo(
      () =>
        Math.round(
          ((product.price - product.offerPrice) / product.price) * 100
        ),
      [product.price, product.offerPrice]
    );

    return (
      <div className="space-y-6">
        {/* Product name */}
        <h1 className="text-2xl font-medium mb-2">
          {product.name || "Product Name"}
        </h1>

        {/* ✅ Description for Desktop & Tablet */}
        <p className="hidden md:block text-gray-600 mb-4">
          {product.description || "No description available"}
        </p>

        {/* Seller */}
        <div className="bg-gray-50 p-4 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {product.sellerName
                  ? product.sellerName.charAt(0).toUpperCase()
                  : "S"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Sold by</p>
              <p className="font-medium text-gray-800">
                {product.sellerName || "Unknown Seller"}
              </p>
            </div>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Image
                key={star}
                className="h-4 w-4"
                src={
                  star <= Math.floor(product.averageRating || 0)
                    ? assets.star_icon
                    : assets.star_dull_icon
                }
                alt={`${star} star`}
                width={16}
                height={16}
              />
            ))}
            <span className="ml-2 text-sm">
              {product.averageRating
                ? product.averageRating.toFixed(1)
                : "No ratings"}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            ({product.reviews?.length || 0} reviews)
          </p>
        </div>

        {/* Price */}
        <div className="flex items-center gap-4">
          <p className="text-2xl font-medium">
            Rs. {product.offerPrice || product.price || 0}
          </p>
          {product.price &&
            product.offerPrice &&
            product.price !== product.offerPrice && (
              <>
                <p className="text-gray-500 line-through">
                  Rs. {product.price}
                </p>
                {discount > 0 && (
                  <p className="text-green-600 text-sm">{discount}% off</p>
                )}
              </>
            )}
        </div>

        {/* Product details */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Delivery:</span>{" "}
              <span className="font-medium text-blue-600">
                {product.deliveryDate?.trim() !== ""
                  ? product.deliveryDate
                  : "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Brand:</span>{" "}
              <span className="font-medium text-gray-800">
                {product.brand || "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Color:</span>{" "}
              <span className="font-medium text-gray-800">
                {product.color || "N/A"}
              </span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">Stock:</span>{" "}
              <span
                className={`font-medium ${
                  Number(product.stock) > 0
                    ? Number(product.stock) <= 5
                      ? "text-orange-600"
                      : "text-green-600"
                    : "text-red-600"
                }`}
              >
                {Number(product.stock) > 0
                  ? Number(product.stock) <= 5
                    ? `Only ${product.stock} left`
                    : `${product.stock} available`
                  : "Out of stock"}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Warranty:</span>{" "}
              <span className="font-medium text-gray-800">
                {product.warrantyDuration?.trim() !== ""
                  ? product.warrantyDuration
                  : "N/A"}
              </span>
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Return Period:</span>{" "}
              <span className="font-medium text-gray-800">
                {product.returnPeriod?.trim() !== ""
                  ? product.returnPeriod
                  : "N/A"}
              </span>
            </p>
          </div>
        </div>

        {/* QR Code */}
        {qrUrl && (
          <div className="flex flex-col md:flex-row items-start gap-6 mt-4 md:justify-between">
            <div className="flex-shrink-0">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <Image
                  src={qrUrl}
                  alt="Product QR Code"
                  width={100}
                  height={100}
                  className="mix-blend-multiply"
                />
              </div>
            </div>

            {colorOptions.length > 1 && (
              <div className="flex flex-col justify-center md:ml-auto min-w-[300px]">
                <div className="font-medium mb-2">Choose Color:</div>
                <div className="flex gap-2">
                  {colorOptions.map((clr) => (
                    <button
                      key={clr}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === clr
                          ? "border-orange-500 ring-2 ring-orange-300"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: clr.toLowerCase() }}
                      title={clr}
                      onClick={() => setSelectedColor(clr)}
                    ></button>
                  ))}
                </div>
                <div className="mt-2 text-sm">
                  Selected:{" "}
                  <span className="font-semibold">{selectedColor}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={() => onAddToCart(product._id)}
            className="w-full px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product._id}
          >
            Add to Cart
          </button>
          <button
            onClick={() => onBuyNow(product._id)}
            className="w-full px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-slate-50 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!product._id}
          >
            Buy Now
          </button>
        </div>

        {/* ✅ Mobile Only Description */}
        <div className="md:hidden mt-4 text-gray-600">
          {product.description || "No description available"}
        </div>
      </div>
    );
  }
);





    // Calculate discount percentage safely
    const discountPercentage = productData.price && productData.offerPrice 
        ? Math.round(((productData.price - productData.offerPrice) / productData.price) * 100)
        : 0;

    // Assume product.color is a string like "Red, Blue, Green"
    const colorOptions = productData.color
        ? productData.color.split(",").map((clr) => clr.trim()).filter(Boolean)
        : [];

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
                {/* Main product section with image on left and details on right */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left column - Product images */}
                    <div className="space-y-4">
                        <div className="rounded-lg overflow-hidden bg-gray-500/10 h-[400px]">
                            <Image
                                src={mainImage || (productData.images && productData.images.length > 0 ? productData.images[0] : assets.product_image1)}
                                alt={productData.name || 'Product image'}
                                className="w-full h-full object-contain mix-blend-multiply"
                                width={800}
                                height={800}
                                priority
                            />
                        </div>

                        {productData.images && productData.images.length > 0 && (
                            <div className="grid grid-cols-5 gap-2">
                                {productData.images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 border-2 ${mainImage === image ? 'border-orange-500' : 'border-transparent'}`}
                                        onClick={() => setMainImage(image)}
                                    >
                                        <Image
                                            src={image}
                                            alt={`Product image ${index + 1}`}
                                            className="w-full h-auto object-cover mix-blend-multiply"
                                            width={100} 
                                            height={100} 
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right column - Product details */}
                    <ProductDetails product={productData} onAddToCart={addToCart} onBuyNow={() => { addToCart(productData._id); if (router?.push) router.push('/cart'); }} />
                </div>

                
                {/* Reviews Section */}
                <div className="w-full">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">Customer <span className="font-medium text-orange-600">Reviews</span></p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    <div className="mt-6 w-full">
                        {/* Review Form */}
                        <div className="mb-8 border p-6 rounded-lg">
                            <h3 className="text-xl font-medium mb-4">Write a Review</h3>
                            <form onSubmit={handleSubmitReview}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Image 
                                                    className="h-6 w-6" 
                                                    src={star <= Number(reviewRating) ? assets.star_icon : assets.star_dull_icon} 
                                                    alt={`${star} star rating`} 
                                                    width={24}
                                                    height={24}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-2 text-gray-600">{reviewRating} out of 5</span>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="review-comment" className="block text-gray-700 mb-2">Your Review</label>
                                    <textarea
                                        id="review-comment"
                                        rows={4}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        placeholder="Share your experience with this product..."
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        required
                                        maxLength={1000}
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={submittingReview || !user}
                                >
                                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                                {!user && (
                                    <p className="mt-2 text-sm text-gray-500">Please log in to submit a review</p>
                                )}
                            </form>
                        </div>
                        
                        {/* Reviews List */}
                        <h3 className="text-xl font-medium mb-4">Customer Reviews</h3>
                        {productData.reviews && productData.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {productData.reviews.map((review, index) => (
                                    <div key={review._id || index} className="border p-4 rounded-lg">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <Image
                                                        key={star}
                                                        className="h-4 w-4"
                                                        src={star <= (review.rating || 0) ? assets.star_icon : assets.star_dull_icon}
                                                        alt={`${star} star`}
                                                        width={16}
                                                        height={16}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                by {review.userName || 'Anonymous'}
                                            </span>
                                            {review.createdAt && (
                                                <span className="text-sm text-gray-500">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                <p>No reviews yet. Be the first to review this product!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Products Section */}
                <div className="flex flex-col items-center">
                    <div className="flex flex-col items-center mb-4 mt-16">
                        <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-600">Products</span></p>
                        <div className="w-28 h-0.5 bg-orange-600 mt-2"></div>
                    </div>
                    {products && products.length > 0 && (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                                {products.slice(0, 5).map((product, index) => (
                                    <ProductCard key={product._id || index} product={product} />
                                ))}
                            </div>
                            <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                                See more
                            </button>
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Product;