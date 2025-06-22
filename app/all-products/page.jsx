'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from 'next/navigation';

const AllProducts = () => {
    const { products } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(20);
    const [sortBy, setSortBy] = useState('newest');
    const [isLoading, setIsLoading] = useState(false);

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const router = useRouter();

    // SEO Meta Data
    const getMetaData = () => {
        const baseTitle = "All Products - HamroEshop";
        const baseDescription = "Explore all products on HamroEshop. Your one-stop online shop for everything you need.";
        
        if (categoryFilter) {
            return {
                title: `${categoryFilter} - HamroEshop`,
                description: `Browse products in ${categoryFilter} category on HamroEshop. Shop online with great deals.`,
                keywords: `${categoryFilter}, buy ${categoryFilter}, ${categoryFilter} online, best ${categoryFilter}`
            };
        }
        
        if (searchQuery) {
            return {
                title: `Search results for "${searchQuery}" - HamroEshop`,
                description: `Search results for "${searchQuery}" on HamroEshop. Find the best deals and offers.`,
                keywords: `${searchQuery}, search ${searchQuery}, buy ${searchQuery}`
            };
        }
        
        return {
            title: baseTitle,
            description: baseDescription,
            keywords: "online shopping, products, deals, quality products, fast shipping"
        };
    };

    const metaData = getMetaData();

    // Update products per page based on screen size
    useEffect(() => {
        const updateProductsPerPage = () => {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            
            if (isMobile) {
                setProductsPerPage(12);
            } else if (isTablet) {
                setProductsPerPage(16);
            } else {
                setProductsPerPage(20);
            }
        };

        updateProductsPerPage();
        window.addEventListener('resize', updateProductsPerPage);
        return () => window.removeEventListener('resize', updateProductsPerPage);
    }, []);

    // Enhanced filtering and sorting
    useEffect(() => {
        setIsLoading(true);
        let filtered = [...products];

        // Category filter
        if (categoryFilter) {
            filtered = filtered.filter(product => 
                product.category?.toLowerCase() === categoryFilter.toLowerCase()
            );
        }

        // Search filter - enhanced to search in multiple fields
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.description?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.tags?.some(tag => tag.toLowerCase().includes(query))
            );
        }

        // Sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => (a.offerPrice || a.price) - (b.offerPrice || b.price));
                break;
            case 'price-high':
                filtered.sort((a, b) => (b.offerPrice || b.price) - (a.offerPrice || a.price));
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'popular':
                filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
                break;
            case 'name':
                filtered.sort((a, b) => a.name?.localeCompare(b.name));
                break;
            default: // newest
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        }

        setFilteredProducts(filtered);
        setCurrentPage(1);
        setIsLoading(false);
    }, [products, searchQuery, categoryFilter, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    // JSON-LD Structured Data
    const generateJsonLd = () => ({
        "@context": "https://schema.org/",
        "@type": "ItemList",
        "itemListElement": currentProducts.map((product, i) => ({
            "@type": "Product",
            "position": i + 1,
            "name": product.name,
            "image": product.images?.[0] || '',
            "sku": product._id,
            "offers": {
                "@type": "Offer",
                "priceCurrency": "NPR",
                "price": product.offerPrice || product.price,
                "availability": "https://schema.org/InStock"
            },
            "aggregateRating": product.rating ? {
                "@type": "AggregateRating",
                "ratingValue": product.rating,
                "reviewCount": product.reviewCount || 1
            } : undefined
        }))
    });

    const getPageTitle = () => {
        if (categoryFilter) return `${categoryFilter} Collection`;
        if (searchQuery) return `Search: "${searchQuery}"`;
        return "All Products";
    };

    const getBreadcrumbs = () => {
        const breadcrumbs = [{ name: 'Home', href: '/' }, { name: 'Products', href: '/products' }];
        if (categoryFilter) {
            breadcrumbs.push({ name: categoryFilter, href: `/products?category=${categoryFilter}` });
        }
        return breadcrumbs;
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const generatePageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            }
        }
        return pages;
    };

    return (
        <>
            <Head>
                <title>{metaData.title}</title>
                <meta name="description" content={metaData.description} />
                <meta name="keywords" content={metaData.keywords} />
                <meta property="og:title" content={metaData.title} />
                <meta property="og:description" content={metaData.description} />
                <meta property="og:type" content="website" />
                <meta name="twitter:title" content={metaData.title} />
                <meta name="twitter:description" content={metaData.description} />
                <link rel="canonical" href="https://www.hamroeshop.com/all-products" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJsonLd()) }}
                />
            </Head>

            <Navbar />
            
            <main className="min-h-screen bg-gray-50">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="px-4 md:px-16 lg:px-32 pt-4">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        {getBreadcrumbs().map((crumb, index) => (
                            <li key={index} className="flex items-center">
                                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                                <a 
                                    href={crumb.href}
                                    className="hover:text-orange-600 transition-colors duration-200"
                                    aria-current={index === getBreadcrumbs().length - 1 ? 'page' : undefined}
                                >
                                    {crumb.name}
                                </a>
                            </li>
                        ))}
                    </ol>
                </nav>

                <div className="flex flex-col items-start px-2 md:px-16 lg:px-32">
                    {/* Header Section */}
                    <header className="pt-8 pb-6 w-full">
                        <div className="flex flex-row items-center justify-between w-full mb-4">
                            <div>
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
                                    {getPageTitle()}
                                </h1>
                                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                            </div>
                            <div className="min-w-[140px]">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="text-sm md:text-base px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                                    aria-label="Sort products"
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">Price ↑</option>
                                    <option value="price-high">Price ↓</option>
                                    <option value="rating">Rating</option>
                                    <option value="popular">Popular</option>
                                    <option value="name">A-Z</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex items-center justify-between w-full">
                            <p className="text-sm md:text-base text-gray-600">
                                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                            </p>
                        </div>
                    </header>

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                        </div>
                    )}

                    {/* Mobile Product Grid */}
                    <section className="md:hidden">
                        <div className="grid grid-cols-2 gap-3">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => {
                                    const price = product.offerPrice || product.price;
                                    const hasDiscount = product.price && product.offerPrice && product.price > product.offerPrice;
                                    const discount = hasDiscount
                                        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
                                        : 0;
                                    
                                    return (
                                        <article
                                            key={product._id || index}
                                            className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                                            onClick={() => {
                                                // Only allow safe IDs (alphanumeric, dash, underscore)
                                                if (typeof product._id === 'string' && /^[a-zA-Z0-9_-]+$/.test(product._id)) {
                                                    router.push(`/product/${product._id}`);
                                                }
                                            }}
                                        >
                                            {/* Image Container */}
                                            <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                                <Image
                                                    src={product.images?.[0] || '/placeholder-image.jpg'}
                                                    alt={product.name}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    sizes="(max-width: 768px) 100vw, 400px"
                                                    loading="lazy"
                                                />
                                                {hasDiscount && (
                                                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        -{discount}%
                                                    </div>
                                                )}
                                                {product.isNew && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        NEW
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Product Info */}
                                            <div className="p-3">
                                                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2 min-h-[2.5rem]">
                                                    {product.name}
                                                </h3>
                                                
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-lg font-bold text-orange-600">
                                                        Rs. {price?.toLocaleString()}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-sm text-gray-500 line-through">
                                                            Rs. {product.price?.toLocaleString()}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                <div className="text-xs text-gray-500 mb-2 capitalize">
                                                    {product.category}
                                                </div>
                                                
                                                {/* Rating and Sales */}
                                                <div className="flex items-center justify-between text-xs">
                                                    {product.rating && (
                                                        <div className="flex items-center gap-1 text-yellow-500">
                                                            <span>★</span>
                                                            <span className="font-medium">{product.rating}</span>
                                                        </div>
                                                    )}
                                                    {product.soldCount && (
                                                        <span className="text-gray-400">
                                                            {product.soldCount} sold
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })
                            ) : (
                                <div className="col-span-2 text-center py-12">
                                    <div className="max-w-md mx-auto">
                                        <div className="text-6xl mb-4">🔍</div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
                                        <p className="text-gray-600 mb-4">
                                            {categoryFilter ? 
                                                `No products found in "${categoryFilter}" category` :
                                                searchQuery ? 
                                                    `No products match "${searchQuery}"` :
                                                    "No products available at the moment"
                                            }
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/products'}
                                            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                                        >
                                            Browse All Products
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Desktop Product Grid */}
                    <section className="hidden md:block">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                    <ProductCard 
                                        key={product._id || index} 
                                        product={product}
                                        loading="lazy"
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <div className="max-w-md mx-auto">
                                        <div className="text-8xl mb-6">🔍</div>
                                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">No Products Found</h3>
                                        <p className="text-gray-600 mb-6">
                                            {categoryFilter ? 
                                                `No products found in "${categoryFilter}" category` :
                                                searchQuery ? 
                                                    `No products match "${searchQuery}"` :
                                                    "No products available at the moment"
                                            }
                                        </p>
                                        <button
                                            onClick={() => window.location.href = '/products'}
                                            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                                        >
                                            Browse All Products
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Enhanced Pagination */}
                    {totalPages > 1 && (
                        <nav 
                            className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200"
                            aria-label="Products pagination"
                        >
                            <div className="text-sm text-gray-600">
                                Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                            </div>
                            
                            <div className="flex items-center space-x-1">
                                <button
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={currentPage === 1}
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    aria-label="Go to previous page"
                                >
                                    Previous
                                </button>
                                
                                {generatePageNumbers().map((page, index) => (
                                    <button
                                        key={index}
                                        className={`px-3 py-2 text-sm font-medium border transition-colors ${
                                            page === currentPage
                                                ? 'bg-orange-50 border-orange-500 text-orange-600'
                                                : page === '...'
                                                ? 'bg-white border-gray-300 text-gray-400 cursor-default'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                                        }`}
                                        disabled={page === '...'}
                                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                ))}
                                
                                <button
                                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    disabled={currentPage === totalPages}
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    aria-label="Go to next page"
                                >
                                    Next
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </main>
            
            <Footer />
        </>
    );
};

export default AllProducts;