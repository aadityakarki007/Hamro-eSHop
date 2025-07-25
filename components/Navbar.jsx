"use client";
import React, { useState } from "react";
import { assets, CartIcon } from "@/assets/assets";
import Blog from 'nextjs'

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useEffect } from "react";
import { HomeIcon, ShoppingBag, Menu, BoxIcon, Phone, ChevronDown } from "lucide-react";

const Navbar = ({ isPromoPage = false, className = "", hideText = false }) => {
  const { isSeller, user } = useAppContext();
  const router = useRouter();
  const { openSignIn } = useClerk();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [router]);

  const categories = [
  "Motors, Tools & DIY",
  "Home & Lifestyle",
  "Sports & Outdoor",
  "Vapes & Drinks",
  "Electronic & Accessories",
  "Mobiles & Laptops",
  "Groceries & Pets",
  "Men's Fashion",
  "Watches & Accessories",
  "Women's Fashion",
  "Health & Beauty",
  "Babies & Toys",
  "Clothing Accessories",
  "Sports & Outdoor Play",
  "Gifts & Decorations",
  "Nursery",
  "Gaming Accessories",
  "Diapering & Potty",
  "Pacifiers & Accessories",
  "Feeding",
  "Remote Control & Vehicles",
  "Toys & Games",
  "Soaps, Cleansers & Bodywash",
  "Bathing Tubs & Seats",
  "Cosmetics & Skin Care",
  "Exercise & Fitness"
];


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleMobileNavigation = (path) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleCategorySelect = (category) => {
    router.push(`/all-products?category=${encodeURIComponent(category)}`);
    setIsCategoryDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  // Dynamic classes based on promo page
  const navClasses = isPromoPage 
    ? `${className} border-none shadow-lg text-white`
    : "flex flex-col md:flex-row items-center gap-4 md:gap-0 justify-between px-4 md:px-16 lg:px-32 py-2 md:py-3 border-b border-gray-300 text-gray-700 sticky top-0 bg-white z-50";

  return (
    <nav className={navClasses}>
      <div className="flex flex-col md:block w-full md:w-auto gap-2 md:gap-3">
        <div className="flex items-center justify-between md:justify-start">
          <Image
            className="cursor-pointer w-24 md:w-32 hover:opacity-80 transition-opacity"
            onClick={() => router.push("/")}
            src={assets.logo}
            alt="logo"
          />
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2 md:gap-3 md:hidden">
              {!hideText && (
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className={`p-1.5 md:p-2 rounded-lg transition-colors ${
                    isPromoPage 
                      ? 'hover:bg-white/20 text-white' 
                      : 'hover:bg-gray-100'
                  }`}
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              )}
              {user ? (
                <UserButton>
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Cart"
                      labelIcon={<CartIcon />}
                      onClick={() => router.push("/cart")}
                    />
                    <UserButton.Action
                      label="Blog"
                      labelIcon={<CartIcon />}
                      onClick={() => router.push("/blog")}
                    />

                    <UserButton.Action
                      label="My Orders"
                      labelIcon={<ShoppingBag />}
                      onClick={() => router.push("/my-orders")}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              ) : (
                !hideText && (
                  <button
                    onClick={(e) => { e.preventDefault(); openSignIn(); }}
                    className={`flex items-center gap-1 md:gap-2 transition-all duration-200 text-sm md:text-base ${
                      isPromoPage 
                        ? 'hover:text-yellow-300 hover:scale-105 text-white' 
                        : 'hover:text-orange-500 hover:scale-105'
                    }`}
                  >
                    <Image src={assets.user_icon} alt="user icon" className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="hidden sm:inline">Account</span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Hidden on promo page when hideText is true */}
        {isMobileMenuOpen && !hideText && (
          <div className={`md:hidden absolute top-full left-0 right-0 py-3 md:py-4 px-4 md:px-6 shadow-lg z-50 ${
            isPromoPage 
              ? 'bg-purple-900/90 backdrop-blur-sm border-b border-purple-700' 
              : 'bg-white border-b border-gray-200'
          }`}>
            <div className="flex flex-col gap-3 md:gap-4">
              <button
                onClick={() => handleMobileNavigation("/")}
                className={`flex items-center gap-2 text-sm md:text-base ${
                  isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <HomeIcon className="w-4 h-4 md:w-5 md:h-5" />
                Home
              </button>
              <button
                onClick={() => handleMobileNavigation("/all-products")}
                className={`flex items-center gap-2 text-sm md:text-base ${
                  isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <BoxIcon className="w-4 h-4 md:w-5 md:h-5" />
                All Products
              </button>
              
              {/* Category Dropdown for Mobile - Only show in hamburger menu if NOT on all-products page */}
              {currentPath !== '/all-products' && (
                <div className="relative">
                  <button
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                    className={`flex items-center justify-between w-full text-sm md:text-base ${
                      isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <BoxIcon className="w-4 h-4 md:w-5 md:h-5" />
                      Categories
                    </div>
                    <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isCategoryDropdownOpen && (
                    <div className={`mt-2 ml-6 md:ml-7 max-h-48 md:max-h-60 overflow-y-auto rounded-lg border ${
                      isPromoPage 
                        ? 'bg-purple-800/90 border-purple-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      {categories.map((category, index) => (
                        <button
                          key={index}
                          onClick={() => handleCategorySelect(category)}
                          className={`block w-full text-left px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-colors ${
                            isPromoPage 
                              ? 'text-white hover:bg-purple-700 hover:text-yellow-300' 
                              : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {user && (
                <>
                  <button
                    onClick={() => handleMobileNavigation("/cart")}
                    className={`flex items-center gap-2 text-sm md:text-base ${
                      isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <div className="w-4 h-4 md:w-5 md:h-5">
                      <CartIcon />
                    </div>
                    Cart
                  </button>
                  <button
                    onClick={() => handleMobileNavigation("/my-orders")}
                    className={`flex items-center gap-2 text-sm md:text-base ${
                      isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4 md:w-5 md:h-5" />
                    My Orders
                  </button>
                </>
              )}
              {isSeller && (
                <button
                  onClick={() => handleMobileNavigation("/seller")}
                  className={`flex items-center gap-2 text-sm md:text-base ${
                    isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                  }`}
                >
                  <BoxIcon className="w-4 h-4 md:w-5 md:h-5" />
                  Seller Dashboard
                </button>
              )}
              <button
                onClick={() => handleMobileNavigation("/contact")}
                className={`flex items-center gap-2 text-sm md:text-base ${
                  isPromoPage ? 'text-white hover:text-yellow-300' : 'text-gray-700 hover:text-orange-600'
                }`}
              >
                <Phone className="w-4 h-4 md:w-5 md:h-5" />
                Contact
              </button>
            </div>
          </div>
        )}

        {/* Mobile Search Bar - Hidden on promo page when hideText is true */}
        {!hideText && (
          <div className="flex items-center gap-1.5 md:gap-2 md:hidden w-full">
            <form onSubmit={handleSearch} className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className={`w-full px-3 md:px-4 py-1.5 md:py-2 border rounded-lg outline-none transition-colors pr-8 md:pr-10 text-sm md:text-base ${
                  isPromoPage 
                    ? 'border-purple-300 bg-white/10 text-white placeholder-white/70 focus:border-yellow-400' 
                    : 'border-gray-300 focus:border-orange-500'
                }`}
              />
              <button type="submit" className={`absolute right-2 md:right-3 top-1/2 -translate-y-1/2 transition-colors ${
                isPromoPage ? 'hover:text-yellow-300' : 'hover:text-orange-500'
              }`}>
                <Image className="w-3.5 h-3.5 md:w-4 md:h-4" src={assets.search_icon} alt="search icon" />
              </button>
            </form>

            {/* Category Filter - Show on Home page and All Products page */}
            {(currentPath === '/all-products' || currentPath === '/') && (
              <div className="relative">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className={`flex items-center gap-1 px-2 md:px-3 py-1.5 md:py-2 border rounded-lg transition-colors text-xs md:text-sm whitespace-nowrap ${
                    isPromoPage 
                      ? 'bg-purple-700/50 border-purple-500 text-white hover:bg-purple-600/50' 
                      : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                  }`}
                >
                  <BoxIcon className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <ChevronDown className={`w-2.5 h-2.5 md:w-3 md:h-3 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoryDropdownOpen && (
                  <div className={`absolute top-full right-0 mt-1 w-44 md:w-48 max-h-52 md:max-h-60 overflow-y-auto rounded-lg border shadow-lg z-50 ${
                    isPromoPage 
                      ? 'bg-purple-800/90 border-purple-600' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <button
                      onClick={() => {
                        router.push('/all-products');
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={`block w-full text-left px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-colors border-b font-medium ${
                        isPromoPage 
                          ? 'text-white hover:bg-purple-700 hover:text-yellow-300 border-purple-600' 
                          : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600 border-gray-100'
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category, index) => (
                      <button
                        key={index}
                        onClick={() => handleCategorySelect(category)}
                        className={`block w-full text-left px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm transition-colors ${
                          isPromoPage 
                            ? 'text-white hover:bg-purple-700 hover:text-yellow-300' 
                            : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Navigation Links - Hidden on promo page when hideText is true */}
      {!hideText && (
        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className={`transition-all duration-200 relative group ${
            isPromoPage 
              ? 'hover:text-yellow-300 hover:scale-105' 
              : 'hover:text-orange-500 hover:scale-105'
          }`}>
            Home
            <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200 ${
              isPromoPage ? 'bg-yellow-300' : 'bg-orange-500'
            }`}></span>
          </Link>
          <Link href="/all-products" className={`transition-all duration-200 relative group ${
            isPromoPage 
              ? 'hover:text-yellow-300 hover:scale-105' 
              : 'hover:text-orange-500 hover:scale-105'
          }`}>
            Shop
            <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200 ${
              isPromoPage ? 'bg-yellow-300' : 'bg-orange-500'
            }`}></span>
          </Link>
          <Link
            href="/about-us"
            className={`transition-all duration-200 relative group ${
              isPromoPage 
                ? 'hover:text-yellow-300 hover:scale-105' 
                : 'hover:text-orange-500 hover:scale-105'
            }`}
          >
            About Us
            <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200 ${
              isPromoPage ? 'bg-yellow-300' : 'bg-orange-500'
            }`}></span>
          </Link>

          <Link href="/contact" className={`transition-all duration-200 relative group ${
            isPromoPage 
              ? 'hover:text-yellow-300 hover:scale-105' 
              : 'hover:text-orange-500 hover:scale-105'
          }`}>
            Contact
            <span className={`absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-200 ${
              isPromoPage ? 'bg-yellow-300' : 'bg-orange-500'
            }`}></span>
          </Link>
        </div>
      )}

      {/* Desktop Menu - Hidden on promo page when hideText is true */}
      {!hideText && (
        <ul className="hidden md:flex items-center gap-4">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className={`w-48 px-3 py-1.5 border rounded-lg outline-none transition-all text-sm ${
                isPromoPage 
                  ? 'border-purple-300 bg-white/10 text-white placeholder-white/70 focus:border-yellow-400 hover:border-purple-200' 
                  : 'border-gray-300 focus:border-orange-500 hover:border-gray-400'
              }`}
            />
            <button type="submit" className={`absolute right-2 top-1/2 -translate-y-1/2 transition-colors ${
              isPromoPage ? 'hover:text-yellow-300' : 'hover:text-orange-500'
            }`}>
              <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
            </button>
          </form>
          <select
            onChange={(e) => {
              if (e.target.value) {
                router.push(`/all-products?category=${encodeURIComponent(e.target.value)}`);
              }
            }}
            className={`px-3 py-1.5 border rounded-md focus:outline-none focus:ring-2 transition-all cursor-pointer ${
              isPromoPage 
                ? 'text-white bg-purple-700/50 border-purple-500 focus:ring-yellow-400 hover:border-purple-400' 
                : 'text-gray-700 bg-white border-gray-300 focus:ring-orange-500 hover:border-gray-400'
            } ${currentPath !== '/all-products' ? 'hidden' : ''}`}
            defaultValue=""
          >
            <option value="">Select Category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
          {isSeller && (
            <button
              onClick={() => router.push("/seller")}
              className={`text-xs border px-4 py-1.5 rounded-full ${
                isPromoPage 
                  ? 'border-purple-300 hover:bg-purple-700/50 text-white' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              Seller Dashboard
            </button>
          )}
          {user ? (
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action
                  label="Home"
                  labelIcon={<HomeIcon />}
                  onClick={() => router.push("/")}
                />
                <UserButton.Action
                  label="Products"
                  labelIcon={<BoxIcon />}
                  onClick={() => router.push("/all-products")}
                />

                <UserButton.Action
                  label="Cart"
                  labelIcon={<CartIcon />}
                  onClick={() => router.push("/cart")}
                />
                <UserButton.Action
                  label="My Orders"
                  labelIcon={<ShoppingBag />}
                  onClick={() => router.push("/my-orders")}
                />
              </UserButton.MenuItems>
            </UserButton>
          ) : (
            <button
              onClick={(e) => { e.preventDefault(); openSignIn(); }}
              className={`flex items-center gap-2 transition-all duration-200 ${
                isPromoPage 
                  ? 'hover:text-yellow-300 hover:scale-105 text-white' 
                  : 'hover:text-orange-500 hover:scale-105'
              }`}
            >
              <Image src={assets.user_icon} alt="user icon" className="w-5 h-5" />
              Account
            </button>
          )}
        </ul>
      )}
    </nav>
  );
};

export default Navbar;