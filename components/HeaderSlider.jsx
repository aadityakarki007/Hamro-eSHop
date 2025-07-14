import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Pure Sound - Your Perfect Headphones Awaits!",
      mobileTitle: "Perfect Headphones!",
      offer: "Limited Time Offer 6% Off",
      mobileOffer: "6% Off",
      buttonText1: "Buy now",
      buttonText2: "Find more",
      imgSrc: assets.header_headphone_image,
      link: "https://www.hamroeshop.com/product/6847e56f94e24a6b4981a855",
      altText: "Premium headphones with superior sound quality",
      bgColor: "bg-gradient-to-r from-orange-50 to-red-50"
    },
    {
      id: 2,
      title: "Next-Level Gaming Starts Here - Discover PlayStation 5 Today!",
      mobileTitle: "PlayStation 5 Today!",
      offer: "Hurry up only few lefts!",
      mobileOffer: "Few left!",
      buttonText1: "Shop Now",
      buttonText2: "Explore Deals",
      imgSrc: assets.header_playstation_image,
      link: "https://www.hamroeshop.com/product/684acf35a9eca259d9bc91c3",
      altText: "PlayStation 5 gaming console for ultimate gaming experience",
      bgColor: "bg-gradient-to-r from-blue-50 to-purple-50"
    },
    {
      id: 3,
      title: "Power Meets Elegance - Apple MacBook Pro is Here for you!",
      mobileTitle: "MacBook Pro Here!",
      offer: "Exclusive Deal 40% Off",
      mobileOffer: "40% Off",
      buttonText1: "Order Now",
      buttonText2: "Learn More",
      imgSrc: assets.header_macbook_image,
      link: "/products",
      altText: "Apple MacBook Pro laptop with powerful performance",
      bgColor: "bg-gradient-to-r from-gray-50 to-slate-50"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <section 
      className="overflow-hidden relative w-full"
      aria-label="Product promotional slider"
    >
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className={`flex flex-row items-center justify-between ${slide.bgColor} py-3 md:py-5 md:px-8 px-4 mt-4 md:mt-6 rounded-lg md:rounded-xl min-w-full md:min-h-[290px] min-h-[120px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            {/* Content Section */}
            <div className="flex-1 pr-2 md:pr-4">
              {/* Offer Badge */}
              <div className="mb-1 md:mb-2">
                <span className="inline-flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium shadow-md animate-pulse">
                  <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                  <span className="md:hidden">{slide.mobileOffer}</span>
                  <span className="hidden md:block">{slide.offer}</span>
                </span>
              </div>

              {/* Main Title */}
              <h2 className="text-gray-800 font-bold mb-2 md:mb-4 leading-tight">
                <span className="md:hidden text-sm bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{slide.mobileTitle}</span>
                <span className="hidden md:block text-xl lg:text-2xl max-w-md bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{slide.title}</span>
              </h2>

              {/* CTA Buttons */}
              <div className="flex flex-row gap-2 md:gap-3">
                {slide.link.startsWith("http") ? (
                  <a
                    href={slide.link}
                    className="inline-block bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1 md:px-6 md:py-2 rounded text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {slide.buttonText1}
                  </a>
                ) : (
                  <Link href={slide.link}>
                    <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-1 md:px-6 md:py-2 rounded text-xs md:text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      {slide.buttonText1}
                    </button>
                  </Link>
                )}
                
                <Link href="/all-products">
                  <button className="group flex items-center gap-1 text-gray-600 hover:text-orange-600 px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm font-medium transition-all duration-300 border border-gray-300 hover:border-orange-300 rounded bg-white/80 hover:bg-orange-50">
                    {slide.buttonText2}
                    <Image 
                      className="group-hover:translate-x-1 transition-transform duration-300 w-3 h-3 md:w-4 md:h-4 group-hover:scale-110" 
                      src={assets.arrow_icon} 
                      alt="" 
                      aria-hidden="true"
                    />
                  </button>
                </Link>
              </div>
            </div>
            
            {/* Image Section */}
            <div className="flex-shrink-0 flex items-center justify-center relative">
              <div className="relative group">
                <Image
                  className="w-16 h-16 md:w-32 md:h-32 lg:w-36 lg:h-36 object-contain transition-transform duration-300 group-hover:scale-110"
                  src={slide.imgSrc}
                  alt={slide.altText}
                  priority={index === 0}
                  loading={index === 0 ? "eager" : "lazy"}
                />
                {/* Floating background effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-100/50 to-red-100/50 rounded-full blur-xl opacity-70 -z-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="flex items-center justify-center gap-2 mt-3 md:mt-4">
        {sliderData.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 md:h-2.5 md:w-2.5 rounded-full transition-all duration-300 transform hover:scale-125 ${
              currentSlide === index 
                ? "bg-gradient-to-r from-orange-500 to-red-500 shadow-lg scale-110" 
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Schema.org structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Featured Products",
            "description": "Promotional slider featuring headphones, gaming consoles, and laptops",
            "itemListElement": sliderData.map((slide, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": slide.title,
              "description": slide.offer,
              "url": slide.link.startsWith("http") ? slide.link : `https://www.hamroeshop.com${slide.link}`
            }))
          })
        }}
      />
    </section>
  );
};

export default HeaderSlider;