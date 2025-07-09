import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/assets';
import React from 'react';

const ProductCard = ({ product }) => {
    // Use product._id directly for link (remove slug completely)
    const productId = product._id;

    // Calculate discount percentage
    const discountPercentage = product.price && product.offerPrice 
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link href={`/product/${productId}`}>
                <div className="cursor-pointer">
                    {/* Product Image */}
                    <div className="relative h-48 bg-gray-100">
                        <Image
                            src={product.images?.[0] || assets.product_image1}
                            alt={product.name || 'Product'}
                            fill
                            className="object-contain mix-blend-multiply p-2"
                        />
                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                                {discountPercentage}% OFF
                            </div>
                        )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="p-4">
                        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2 h-12">
                            {product.name || 'Product Name'}
                        </h3>
                        
                        {/* Price */}
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg font-bold text-orange-600">
                                Rs. {product.offerPrice || product.price || 0}
                            </span>
                            {product.price && product.offerPrice && product.price !== product.offerPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                    Rs. {product.price}
                                </span>
                            )}
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                            <div className="flex items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Image
                                        key={star}
                                        src={star <= Math.floor(product.averageRating || 0) ? assets.star_icon : assets.star_dull_icon}
                                        alt={`${star} star`}
                                        width={12}
                                        height={12}
                                        className="w-3 h-3"
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-600 ml-1">
                                ({product.reviews?.length || 0})
                            </span>
                        </div>
                        
                        {/* Stock Status */}
                        <div className="text-xs">
                            {Number(product.stock) > 0 ? (
                                <span className={`${Number(product.stock) <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {Number(product.stock) <= 5 ? `Only ${product.stock} left` : 'In Stock'}
                                </span>
                            ) : (
                                <span className="text-red-600">Out of Stock</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
