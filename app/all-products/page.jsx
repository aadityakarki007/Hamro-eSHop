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
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // grid or list

   
    
    // Filter states
    const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [inStock, setInStock] = useState(false);
    const [freeShipping, setFreeShipping] = useState(false);

    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search') || '';
    const categoryFilter = searchParams.get('category') || '';
    const router = useRouter();

    // Get unique categories, brands, and price ranges
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
    const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const maxPrice = Math.max(...products.map(p => p.price || 0));
    const minPrice = Math.min(...products.map(p => p.price || 0));

    // Popular categories with icons
    // Popular categories with consolidated subcategories - maximum 6 categories
const popularCategories = [
    { 
        name: 'Technology & Electronics', // Combined: Electronic & Accessories + Mobiles & Laptops + Gaming Accessories
        icon: '💻', 
        subcategories: ['Electronic & Accessories', 'Mobiles & Laptops', 'Gaming Accessories'],
        count: products.filter(p => 
            ['Electronic & Accessories', 'Mobiles & Laptops', 'Gaming Accessories'].includes(p.category)
        ).length 
    },
    { 
        name: 'Fashion & Accessories', // Combined: Men's Fashion + Women's Fashion + Watches & Accessories + Clothing Accessories
        icon: '👗', 
        subcategories: ['Men\'s Fashion', 'Women\'s Fashion', 'Watches & Accessories', 'Clothing Accessories'],
        count: products.filter(p => 
            ['Men\'s Fashion', 'Women\'s Fashion', 'Watches & Accessories', 'Clothing Accessories'].includes(p.category)
        ).length 
    },
    { 
        name: 'Home & Lifestyle', // Combined: Home & Lifestyle + Gifts & Decorations
        icon: '🏠', 
        subcategories: ['Home & Lifestyle', 'Gifts & Decorations'],
        count: products.filter(p => 
            ['Home & Lifestyle', 'Gifts & Decorations'].includes(p.category)
        ).length 
    },
    { 
        name: 'Health & Beauty', // Combined: Health & Beauty + Cosmetics & Skin Care + Soaps, Cleansers & Bodywash
        icon: '💄', 
        subcategories: ['Health & Beauty', 'Cosmetics & Skin Care', 'Soaps, Cleansers & Bodywash'],
        count: products.filter(p => 
            ['Health & Beauty', 'Cosmetics & Skin Care', 'Soaps, Cleansers & Bodywash'].includes(p.category)
        ).length 
    },
    { 
        name: 'Kids & Family', // Combined: Babies & Toys + Toys & Games + Nursery + Diapering & Potty + Feeding + etc.
        icon: '🧸', 
        subcategories: ['Babies & Toys', 'Toys & Games', 'Nursery', 'Diapering & Potty', 'Pacifiers & Accessories', 'Feeding', 'Remote Control & Vehicles', 'Bathing Tubs & Seats'],
        count: products.filter(p => 
            ['Babies & Toys', 'Toys & Games', 'Nursery', 'Diapering & Potty', 'Pacifiers & Accessories', 'Feeding', 'Remote Control & Vehicles', 'Bathing Tubs & Seats'].includes(p.category)
        ).length 
    },
    { 
        name: 'Sports & Outdoor', // Combined: Sports & Outdoor + Sports & Outdoor Play + Exercise & Fitness + Motors, Tools & DIY + Groceries & Pets + Vapes & Drinks
        icon: '⚽', 
        subcategories: ['Sports & Outdoor', 'Sports & Outdoor Play', 'Exercise & Fitness', 'Motors, Tools & DIY', 'Groceries & Pets', 'Vapes & Drinks'],
        count: products.filter(p => 
            ['Sports & Outdoor', 'Sports & Outdoor Play', 'Exercise & Fitness', 'Motors, Tools & DIY', 'Groceries & Pets', 'Vapes & Drinks'].includes(p.category)
        ).length 
    }
];



    // SEO Meta Data
    // Updated getMetaData function
const getMetaData = () => {
    const baseTitle = "All Products - HamroEshop";
    const baseDescription = "Explore all products on HamroEshop. Your one-stop online shop for everything you need.";
    
    // Handle slug-based category
    const categorySlug = searchParams.get('cat');
    if (categorySlug) {
        const matchedCategory = popularCategories.find(cat => 
            cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') === categorySlug
        );
        if (matchedCategory) {
            return {
                title: `${matchedCategory.name} - HamroEshop`,
                description: `Browse ${matchedCategory.name} products on HamroEshop. Shop online with great deals.`,
                keywords: `${matchedCategory.name}, buy ${matchedCategory.name}, ${matchedCategory.name} online, best ${matchedCategory.name}`
            };
        }
    }
    
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
    // Enhanced filtering and sorting with support for multiple categories
// Updated useEffect with slug-based category filtering
useEffect(() => {
    setIsLoading(true);
    let filtered = [...products];

    // Handle category slug parameter (new logic)
    const categorySlug = searchParams.get('cat');
    if (categorySlug) {
        // Find the popular category that matches the slug
        const matchedCategory = popularCategories.find(cat => 
            cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') === categorySlug
        );
        
        if (matchedCategory) {
            filtered = filtered.filter(product => 
                matchedCategory.subcategories.some(subcat => 
                    product.category?.toLowerCase() === subcat.toLowerCase()
                )
            );
        }
    }

    // Handle regular category parameters (existing logic)
    const categoryParams = searchParams.getAll('category');
    if (categoryParams.length > 0) {
        filtered = filtered.filter(product => 
            categoryParams.some(cat => 
                product.category?.toLowerCase() === cat.toLowerCase()
            )
        );
    }

    // Multiple category filter from sidebar (existing logic)
    if (selectedCategories.length > 0) {
        filtered = filtered.filter(product =>
            selectedCategories.some(cat => 
                product.category?.toLowerCase().includes(cat.toLowerCase())
            )
        );
    }

    // Brand filter (existing logic)
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(product =>
            selectedBrands.includes(product.brand)
        );
    }

    // Price range filter (existing logic)
    filtered = filtered.filter(product => {
        const price = product.offerPrice || product.price;
        return price >= priceRange.min && price <= priceRange.max;
    });

    // Rating filter (existing logic)
    if (selectedRatings.length > 0) {
        filtered = filtered.filter(product =>
            selectedRatings.some(rating => product.rating >= rating)
        );
    }

    // Stock filter (existing logic)
    if (inStock) {
        filtered = filtered.filter(product => product.stock > 0);
    }

    // Free shipping filter (existing logic)
    if (freeShipping) {
        filtered = filtered.filter(product => product.freeShipping);
    }

    // Search filter (existing logic)
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(product =>
            product.name?.toLowerCase().includes(query) ||
            product.description?.toLowerCase().includes(query) ||
            product.category?.toLowerCase().includes(query) ||
            product.brand?.toLowerCase().includes(query) ||
            product.tags?.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Sorting (existing logic)
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
        case 'discount':
            filtered.sort((a, b) => {
                const discountA = a.price && a.offerPrice ? ((a.price - a.offerPrice) / a.price) * 100 : 0;
                const discountB = b.price && b.offerPrice ? ((b.price - b.offerPrice) / b.price) * 100 : 0;
                return discountB - discountA;
            });
            break;
        default: // newest
            filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setIsLoading(false);
}, [products, searchQuery, categoryFilter, sortBy, selectedCategories, selectedBrands, priceRange, selectedRatings, inStock, freeShipping, searchParams]);


    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories([]);
        setSelectedBrands([]);
        setSelectedRatings([]);
        setPriceRange({ min: minPrice, max: maxPrice });
        setInStock(false);
        setFreeShipping(false);
    };

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, startIndex + productsPerPage);

    // Filter sidebar component
    const FilterSidebar = ({ isMobile = false }) => (
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${isMobile ? 'p-4' : 'p-6'}`}>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                    onClick={clearFilters}
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                    Clear All
                </button>
            </div>

            {/* Categories */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                    {categories.map((category) => (
                        <label key={category} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedCategories([...selectedCategories, category]);
                                    } else {
                                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                                    }
                                }}
                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{category}</span>
                            <span className="ml-auto text-xs text-gray-500">
                                ({products.filter(p => p.category === category).length})
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || maxPrice})}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Rs. {minPrice.toLocaleString()}</span>
                        <span>Rs. {maxPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {brands.map((brand) => (
                            <label key={brand} className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedBrands.includes(brand)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedBrands([...selectedBrands, brand]);
                                        } else {
                                            setSelectedBrands(selectedBrands.filter(b => b !== brand));
                                        }
                                    }}
                                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{brand}</span>
                                <span className="ml-auto text-xs text-gray-500">
                                    ({products.filter(p => p.brand === brand).length})
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Rating */}
            <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                        <label key={rating} className="flex items-center">
                            <input
                                type="checkbox"
                                checked={selectedRatings.includes(rating)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedRatings([...selectedRatings, rating]);
                                    } else {
                                        setSelectedRatings(selectedRatings.filter(r => r !== rating));
                                    }
                                }}
                                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                            />
                            <span className="ml-2 flex items-center text-sm text-gray-700">
                                {Array.from({length: 5}, (_, i) => (
                                    <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                        ★
                                    </span>
                                ))}
                                <span className="ml-1">& above</span>
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Additional Filters */}
            <div className="space-y-3">
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="checkbox"
                        checked={freeShipping}
                        onChange={(e) => setFreeShipping(e.target.checked)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Free Shipping</span>
                </label>
            </div>
        </div>
    );

    // Popular Categories Sidebar
    // Popular Categories Sidebar with improved URL handling
const PopularCategoriesSection = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h2>
        <div className="space-y-3">
            {popularCategories.map((category) => {
                // Create a short slug from category name
                const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                
                return (
                    <button
                        key={category.name}
                        onClick={() => {
                            router.push(`/all-products?cat=${categorySlug}`);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{category.icon}</span>
                            <span className="text-sm font-medium text-gray-900">{category.name}</span>
                        </div>
                        <span className="text-xs text-gray-500 group-hover:text-gray-700">
                            {category.count} items
                        </span>
                    </button>
                );
            })}
        </div>
    </div>
);

    // Product Card for List View
    const ProductListCard = ({ product, index }) => {
        const price = product.offerPrice || product.price;
        const hasDiscount = product.price && product.offerPrice && product.price > product.offerPrice;
        const discount = hasDiscount
            ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
            : 0;
        
        return (
            <article
                key={product._id || index}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                onClick={() => {
                    if (typeof product._id === 'string' && /^[a-zA-Z0-9_-]+$/.test(product._id)) {
                        router.push(`/product/${product._id}`);
                    }
                }}
            >
                <div className="flex p-4">
                    {/* Image */}
                    <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                            src={product.images?.[0] || '/placeholder-image.jpg'}
                            alt={product.name}
                            width={128}
                            height={128}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                        {hasDiscount && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                -{discount}%
                            </div>
                        )}
                    </div>
                    
                    {/* Product Info */}
                    <div className="flex-1 ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {product.name}
                        </h3>
                        
                        <div className="flex items-center gap-4 mb-3">
                            <span className="text-xl font-bold text-orange-600">
                                Rs. {price?.toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <span className="text-sm text-gray-500 line-through">
                                    Rs. {product.price?.toLocaleString()}
                                </span>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-4 mb-3">
                            {product.rating && (
                                <div className="flex items-center gap-1">
                                    <div className="flex text-yellow-400">
                                        {Array.from({length: 5}, (_, i) => (
                                            <span key={i} className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}>
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-sm text-gray-600">({product.rating})</span>
                                </div>
                            )}
                            <span className="text-sm text-gray-500 capitalize">{product.category}</span>
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                            {product.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                {product.soldCount && (
                                    <span>{product.soldCount} sold</span>
                                )}
                                {product.freeShipping && (
                                    <span className="text-green-600 font-medium">Free Shipping</span>
                                )}
                            </div>
                            {product.isNew && (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                                    NEW
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        );
    };

   // Updated getPageTitle function
const getPageTitle = () => {
    const categorySlug = searchParams.get('cat');
    if (categorySlug) {
        const matchedCategory = popularCategories.find(cat => 
            cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') === categorySlug
        );
        if (matchedCategory) {
            return `${matchedCategory.name} Collection`;
        }
    }
    
    if (categoryFilter) return `${categoryFilter} Collection`;
    if (searchQuery) return `Search: "${searchQuery}"`;
    return "All Products";
};
    // Updated getBreadcrumbs function to handle slug-based categories
const getBreadcrumbs = () => {
    const breadcrumbs = [{ name: 'Home', href: '/' }, { name: 'Products', href: '/all-products' }];
    
    // Handle slug-based category
    const categorySlug = searchParams.get('cat');
    if (categorySlug) {
        const matchedCategory = popularCategories.find(cat => 
            cat.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-') === categorySlug
        );
        if (matchedCategory) {
            breadcrumbs.push({ 
                name: matchedCategory.name, 
                href: `/all-products?cat=${categorySlug}` 
            });
        }
    }
    
    // Handle regular category filter
    if (categoryFilter) {
        breadcrumbs.push({ name: categoryFilter, href: `/all-products?category=${categoryFilter}` });
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

// Add the QuickCategoriesSection component here
const QuickCategoriesSection = () => (
    <div className="lg:hidden px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Categories</h3>
            <div className="grid grid-cols-3 gap-2">
                {popularCategories.slice(0, 6).map((category) => {
                    const categorySlug = category.name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    
                    return (
                        <button
                            key={category.name}
                            onClick={() => router.push(`/all-products?cat=${categorySlug}`)}
                            className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <span className="text-2xl mb-1">{category.icon}</span>
                            <span className="text-xs font-medium text-gray-900 text-center">{category.name}</span>
                            <span className="text-xs text-gray-500">{category.count}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    </div>
);
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
            </Head>

            <Navbar />
            
            <main className="min-h-screen bg-gray-50">
                {/* Breadcrumb Navigation */}
                <nav aria-label="Breadcrumb" className="px-4 md:px-6 lg:px-8 pt-4">
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

                <div className="flex px-4 md:px-6 lg:px-8 py-6 gap-6">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-80 flex-shrink-0 space-y-6">
                        <PopularCategoriesSection />
                        <FilterSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Header Section */}
                        <header className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                        {getPageTitle()}
                                    </h1>
                                    <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-2"></div>
                                    <p className="text-sm text-gray-600">
                                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                                    </p>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    {/* Mobile Filter Button */}
                                    <button
                                        onClick={() => setShowMobileFilters(true)}
                                        className="lg:hidden px-4 py-2 bg-orange-50 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors flex items-center gap-2"
                                    >
                                        <span>🔍</span>
                                        <span>Filters</span>
                                    </button>
                                    
                                    {/* View Mode Toggle */}
                                    <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                viewMode === 'grid' 
                                                    ? 'bg-white text-gray-900 shadow-sm' 
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            Grid
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                                viewMode === 'list' 
                                                    ? 'bg-white text-gray-900 shadow-sm' 
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        >
                                            List
                                        </button>
                                    </div>
                                    
                                    {/* Sort Dropdown */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm min-w-[160px]"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Highest Rated</option>
                                        <option value="popular">Most Popular</option>
                                        <option value="discount">Highest Discount</option>
                                        <option value="name">Name: A-Z</option>
                                    </select>
                                </div>
                            </div>
                        </header>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                            </div>
                        )}

         

{/* Outer container for desktop/tablet only */}
<div className="hidden md:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  {viewMode === 'grid' ? (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentProducts.map((product, index) => (
        <ProductCard 
          key={product._id || index} 
          product={product}
          loading="lazy"
        />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      {currentProducts.map((product, index) => (
        <ProductListCard 
          key={product._id || index} 
          product={product}
          index={index}
        />
      ))}
    </div>
  )}
</div>

{/* Mobile Product Grid without outer box */}
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
            onClick={() => window.location.href = '/all-products'}
            className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
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
                                className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                                aria-label="Products pagination"
                            >
                                <div className="text-sm text-gray-600">
                                    Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                                </div>
                                
                                <div className="flex items-center space-x-1">
                                    <button
                                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        aria-label="Go to previous page"
                                    >
                                        Previous
                                    </button>
                                    
                                    {generatePageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 text-sm font-medium border transition-colors ${
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
                                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                </div>

                {/* Mobile Filter Modal */}
                {showMobileFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)} />
                        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                <button
                                    onClick={() => setShowMobileFilters(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="p-4">
                                <FilterSidebar isMobile={true} />
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => setShowMobileFilters(false)}
                                        className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={() => {
                                            clearFilters();
                                            setShowMobileFilters(false);
                                        }}
                                        className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

               {/* Quick Categories Banner - Mobile */}
<QuickCategoriesSection />
                {/* Floating Action Button for Mobile Filters */}
                <div className="lg:hidden fixed bottom-6 right-6 z-40">
                    <button
                        onClick={() => setShowMobileFilters(true)}
                        className="w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                        </svg>
                    </button>
                </div>

                {/* Back to Top Button */}
                <div className="fixed bottom-6 left-6 z-40">ag
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="w-12 h-12 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-900 transition-colors flex items-center justify-center opacity-75 hover:opacity-100"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                    </button>
                </div>

                {/* Active Filters Display */}
                {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedRatings.length > 0 || inStock || freeShipping) && (
                    <div className="px-4 md:px-6 lg:px-8 pb-4">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-medium text-gray-900">Active Filters</h3>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                    <span
                                        key={category}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800"
                                    >
                                        {category}
                                        <button
                                            onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== category))}
                                            className="ml-2 text-orange-600 hover:text-orange-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {selectedBrands.map((brand) => (
                                    <span
                                        key={brand}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {brand}
                                        <button
                                            onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {selectedRatings.map((rating) => (
                                    <span
                                        key={rating}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800"
                                    >
                                        {rating}+ Stars
                                        <button
                                            onClick={() => setSelectedRatings(selectedRatings.filter(r => r !== rating))}
                                            className="ml-2 text-yellow-600 hover:text-yellow-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                                {inStock && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                        In Stock
                                        <button
                                            onClick={() => setInStock(false)}
                                            className="ml-2 text-green-600 hover:text-green-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                                {freeShipping && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                                        Free Shipping
                                        <button
                                            onClick={() => setFreeShipping(false)}
                                            className="ml-2 text-purple-600 hover:text-purple-800"
                                        >
                                            ×
                                        </button>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
            
            <Footer />
        </>
    );
};

export default AllProducts;