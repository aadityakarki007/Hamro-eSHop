import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="pb-24 md:pb-0 text-gray-500 border-t border-gray-300/30">
      {/* Desktop Layout */}
      <div className="hidden md:flex justify-between items-start px-6 md:px-16 lg:px-32 gap-10 py-14">
        {/* About */}
        <div className="w-1/3 max-w-md">
          <Image className="w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed">
            🛒 <strong>About eShop</strong><br />
            eShop is your reliable online shopping destination, offering a wide
            range of quality products at great prices. We ensure secure payments 🔒,
            fast delivery 🚚, and excellent customer support 💬 to make your shopping
            experience easy and enjoyable.
          </p>
          <p className="mt-4 text-xs text-gray-600">
            <strong>CEO:</strong> Aaditya Karki
          </p>
        </div>

        {/* Company */}
        <div className="w-1/3 flex justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li><a className="hover:underline transition" href="#">Home</a></li>
              <li><a className="hover:underline transition" href="/about-us">About us</a></li>
              <li><a className="hover:underline transition" href="/contact">Contact us</a></li>
              <li><a className="hover:underline transition" href="/privacy-policy">Privacy policy</a></li>
            </ul>
          </div>
        </div>

        {/* Get in Touch */}
        <div className="w-1/3 flex justify-end">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+9779828086387</p>
              <p>+9779840186285</p>
              <p>service.eshopnepal@gmail.com</p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col md:hidden px-6 gap-10 py-12">
        {/* About */}
        <div>
          <Image className="w-28" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm leading-relaxed">
            🛒 <strong>About eShop</strong><br />
            eShop is your reliable online shopping destination, offering a wide
            range of quality products at great prices. We ensure secure payments 🔒,
            fast delivery 🚚, and excellent customer support 💬 to make your shopping
            experience easy and enjoyable.
          </p>
          <p className="mt-4 text-xs text-gray-600">
            <strong>CEO:</strong> Aaditya Karki
          </p>
        </div>

        {/* Company + Get in Touch Side by Side */}
        <div className="flex justify-between gap-6">
          {/* Company */}
          <div>
            <h2 className="font-medium text-gray-900 mb-4">Company</h2>
            <ul className="text-sm space-y-1">
              <li><a className="hover:underline transition" href="#">Home</a></li>
              <li><a className="hover:underline transition" href="/about-us">About us</a></li>
              <li><a className="hover:underline transition" href="/contact">Contact us</a></li>
              <li><a className="hover:underline transition" href="/privacy-policy">Privacy policy</a></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h2 className="font-medium text-gray-900 mb-4">Get in touch</h2>
            <div className="text-sm space-y-1">
              <p>+9779828086387</p>
              <p>+977840186285</p>
              <p>service.eshopnepal@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links to Return Policy and Terms & Conditions */}
      <div className="flex justify-center gap-6 mt-6">
        <a
          href="/return-policy"
          className="text-xs md:text-sm text-green-700 hover:underline transition"
        >
          Return Policy
        </a>
        <a
          href="/terms&conditions"
          className="text-xs md:text-sm text-green-700 hover:underline transition"
        >
          Terms & Conditions
        </a>
        <a
          href="/termsofservice"
          className="text-xs md:text-sm text-green-700 hover:underline transition"
        >
          Terms of Service
        </a>
      </div>

      {/* Development Team Credits */}
      <div className="px-6 md:px-16 lg:px-32 mt-6">
        <p className="text-center text-xs text-gray-600 leading-relaxed">
          <strong>Developed, Designed and Edited by:</strong><br />
          Aaditya Karki, Rupak Bhattarai, Sulav Panthi, Samyog Aryal, Kush Lama, Kritish Bhandari, Awmish Panta
        </p>
      </div>

      {/* Footer Bottom Text */}
      <p className="py-4 text-center text-xs md:text-sm">
        © 2025 Hamro eShop. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;