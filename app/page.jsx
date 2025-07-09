'use client';

import React from "react";
import Head from "next/head";
import HeaderSlider from "@/components/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import Banner from "@/components/Banner";
import NewsLetter from "@/components/NewsLetter";
import FeaturedProduct from "@/components/FeaturedProduct";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileNavBar from "@/components/MobileNavBar";
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Home = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleTryClick = () => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/sign-in?redirect_url=/trypromo');
    } else {
      router.push('/trypromo');
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>Hamro eShop - Best Deals on Electronics, Fashion, and More</title>
        <meta name="description" content="Shop headphones, gaming, laptops, and more at Hamro eShop. Discover exclusive deals and top brands." />
        <meta property="og:title" content="Hamro eShop - Best Deals" />
        <meta property="og:description" content="Shop headphones, gaming, laptops, and more at Hamro eShop." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:type" content="website" />
      </Head>

      <Navbar />

      <main>
        <div className="px-6 md:px-16 lg:px-32">
          <HeaderSlider />
          <HomeProducts />
          <FeaturedProduct />
          <Banner />

          {/* Try Your Luck Section with attractive background */}
          <section className="text-center py-16 my-12 rounded-xl bg-gradient-to-r from-violet-50 to-pink-50 shadow-inner">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-pulse">
              ✨ Unlock Your Special Promo Code Today ✨
            </h1>
            <p className="text-gray-600 mt-4 text-lg md:text-xl max-w-2xl mx-auto">
              Choose any number from 1 to 100 and unlock a special promo code just for you!
            </p>
            <div className="mt-8">
              <button
                onClick={handleTryClick}
                disabled={!isLoaded}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-12 rounded-full shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Try Your Luck"
              >
                {!isLoaded ? '⏳ Loading...' : '🎲 Try Your Luck'}
              </button>
            </div>
          </section>

          <NewsLetter />
        </div>
      </main>

      <Footer />
      <MobileNavBar />
    </div>
  );
};

export default Home;
