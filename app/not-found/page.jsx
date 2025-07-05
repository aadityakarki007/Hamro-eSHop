import next from 'next';
import Link from 'next/link';

import React
 from 'react';

export const metadata = {
  title: '404 - Page Not Found | Hamro eShop',
  description: 'The page you are looking for does not exist. Browse our electronics, fashion, and gadgets collection.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Number */}
        <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
          404
        </div>
        
        {/* Main heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Oops! Page Not Found
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-8 text-lg">
          The page you're looking for doesn't exist. But don't worry, we have plenty of amazing products waiting for you!
        </p>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🏠 Go Home
          </Link>
          
          <Link 
            href="/all-products"
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🛍️ Shop Now
          </Link>
        </div>
        
        {/* Popular categories */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Or explore our popular categories:
          </h2>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/electronics" className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm text-gray-700 hover:text-purple-600">
              📱 Electronics
            </Link>
            <Link href="/fashion" className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm text-gray-700 hover:text-purple-600">
              👕 Fashion
            </Link>
            <Link href="/gadgets" className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm text-gray-700 hover:text-purple-600">
              🎮 Gadgets
            </Link>
            <Link href="/deals" className="px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow text-sm text-gray-700 hover:text-purple-600">
              💰 Deals
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}