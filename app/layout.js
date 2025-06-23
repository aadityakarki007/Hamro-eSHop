// app/layout.js
import React from 'react';
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from '@clerk/nextjs';
import MobileNavBar from '@/components/MobileNavBar';

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] });

export const metadata = {
  metadataBase: new URL("https://hamroeshop.com"),
  title: "Hamro eShop - Online Shopping for Electronics, Fashion & Gadgets in Nepal",
  description: "Shop quality electronics, fashion items, gadgets, home appliances and more at Hamro eShop. Reliable online shopping experience with secure payment options and fast delivery across Nepal.",
  keywords: [
    "Hamro eShop", "online shopping Nepal", "ecommerce Nepal", "electronics Nepal", "fashion online Nepal", "gadgets Nepal", "mobile phones Nepal", "laptops Nepal", "home appliances Nepal", "online store Nepal", "buy online Nepal", "shopping Nepal", "Kathmandu online shopping", "Nepal ecommerce", "digital shopping Nepal", "online marketplace Nepal", "secure online shopping", "fast delivery Nepal", "quality products Nepal", "affordable shopping Nepal", "tech gadgets Nepal", "smartphone Nepal", "computer accessories Nepal", "gaming accessories Nepal", "women fashion Nepal", "men fashion Nepal", "kitchen appliances Nepal", "electronic accessories Nepal"
  ],
  openGraph: {
    title: "Hamro eShop - Quality Online Shopping in Nepal",
    description: "Discover quality electronics, fashion, gadgets and home essentials at Hamro eShop. Trusted online shopping with secure payments and nationwide delivery in Nepal.",
    url: "https://hamroeshop.com",
    siteName: "Hamro eShop",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "Hamro eShop - Online Shopping Nepal"
      },
    ],
    locale: "en_NP",
    type: "website",
  },
  alternates: {
    canonical: "https://hamroeshop.com",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "eCommerce",
  applicationName: "Hamro eShop",
  creator: "Hamro eShop Team",
  publisher: "Hamro eShop",
  language: "en-NP",
  region: "NP",
  geo: {
    placename: "Nepal",
    position: "28.3949;84.1240",
  },
  other: {
    "google-site-verification": "your-google-verification-code-here",
    "msvalidate.01": "your-bing-verification-code-here",
  },
  verification: {
    google: "your-google-verification-code-here",
    yandex: "your-yandex-verification-code-here",
    yahoo: "your-yahoo-verification-code-here",
  },
  business: {
    type: "OnlineStore",
    name: "Hamro eShop",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NP",
      addressLocality: "Kathmandu",
      addressRegion: "Bagmati",
    },
    telephone: "+977-9828086387",
    email: "service.eshopnepal@gmail.com",
    url: "https://hamroeshop.com",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/"
      afterSignUpUrl="/"
    >
      <html lang="en" suppressHydrationWarning={true}>
        <head>
          <meta name="description" content="Quality online shopping for electronics, fashion, gadgets and home essentials in Nepal. Secure payments, reliable delivery, and authentic products at competitive prices." />
          <meta name="keywords" content="online shopping Nepal, electronics Nepal, fashion Nepal, gadgets Nepal, ecommerce Nepal, buy online Nepal, Kathmandu shopping, Nepal online store, mobile phones Nepal, laptops Nepal, home appliances Nepal, secure shopping Nepal, authentic products Nepal, competitive prices Nepal, reliable delivery Nepal, quality products Nepal, tech accessories Nepal, gaming Nepal, women fashion Nepal, men fashion Nepal, kitchen appliances Nepal, smartphone accessories Nepal, computer parts Nepal, electronic gadgets Nepal, online marketplace Nepal, digital shopping Nepal, Nepal ecommerce platform, online retail Nepal, shopping website Nepal, buy electronics online Nepal, fashion store Nepal, gadget store Nepal" />
          <meta name="author" content="Hamro eShop" />
         
          <meta name="copyright" content="Hamro eShop" />
          <meta name="application-name" content="Hamro eShop" />
          <meta name="geo.region" content="NP" />
          <meta name="geo.placename" content="Nepal" />
          <meta name="geo.position" content="28.3949;84.1240" />
          <meta name="ICBM" content="28.3949, 84.1240" />
          <meta name="language" content="English, Nepali" />
          <meta name="country" content="Nepal" />
          <meta name="distribution" content="global" />
          <meta name="rating" content="general" />
          <meta name="revisit-after" content="7 days" />
          <meta name="audience" content="all" />
          <meta name="subject" content="Online Shopping Nepal" />
          <meta name="coverage" content="Nepal" />
          <meta name="classification" content="eCommerce" />
          <meta name="HandheldFriendly" content="True" />
          <meta name="MobileOptimized" content="320" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Hamro eShop" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-TileColor" content="#ea580c" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <meta name="referrer" content="origin-when-cross-origin" />
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          <meta name="slurp" content="index, follow" />
          <meta name="duckduckbot" content="index, follow" />
          
          {/* Business Contact Information */}
          <meta name="contact" content="service.eshopnepal@gmail.com" />
          <meta name="phone" content="+977-9828086387" />
          <meta name="location" content="Kathmandu, Nepal" />
          
          {/* Page-specific meta tags */}
          <meta name="page-topic" content="Online Shopping" />
          <meta name="page-type" content="eCommerce Homepage" />
          <meta name="audience" content="Nepal consumers, online shoppers" />
          <meta name="target_country" content="Nepal" />
          <meta name="target_language" content="English, Nepali" />
          
          {/* Content categorization */}
          <meta name="category" content="eCommerce, Electronics, Fashion, Gadgets, Home Appliances" />
          <meta name="news_keywords" content="online shopping Nepal, ecommerce Nepal, electronics Nepal, fashion Nepal" />
          
          {/* Social media optimization */}
          <meta property="og:email" content="service.eshopnepal@gmail.com" />
          <meta property="og:phone_number" content="+977-9828086387" />
          <meta property="og:street-address" content="Kathmandu" />
          <meta property="og:locality" content="Kathmandu" />
          <meta property="og:region" content="Bagmati" />
          <meta property="og:postal-code" content="" />
          <meta property="og:country-name" content="Nepal" />
          
          {/* Additional SEO meta tags */}
          <meta name="dc.title" content="Hamro eShop - Online Shopping Nepal" />
          <meta name="dc.description" content="Quality online shopping for electronics, fashion, gadgets in Nepal" />
          <meta name="dc.creator" content="Hamro eShop" />
          <meta name="dc.subject" content="Online Shopping, eCommerce, Nepal" />
          <meta name="dc.publisher" content="Hamro eShop" />
          <meta name="dc.contributor" content="Hamro eShop Team" />
          <meta name="dc.type" content="InteractiveResource" />
          <meta name="dc.format" content="text/html" />
          <meta name="dc.language" content="en-NP" />
          <meta name="dc.coverage" content="Nepal" />
          <meta name="dc.rights" content="© Hamro eShop" />

          {/* Enhanced E-commerce structured data (JSON-LD) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "OnlineStore",
                name: "Hamro eShop",
                url: "https://hamroeshop.com",
                logo: "https://hamroeshop.com/og.webp",
                image: "https://hamroeshop.com/og.webp",
                description: "Quality online shopping for electronics, fashion, gadgets and home essentials in Nepal with secure payments and reliable delivery.",
                email: "service.eshopnepal@gmail.com",
                telephone: "+977-9828086387",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "NP",
                  addressLocality: "Kathmandu",
                  addressRegion: "Bagmati"
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 28.3949,
                  longitude: 84.1240
                },
                currenciesAccepted: "NPR",
                paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Online Banking", "Digital Wallet"],
                priceRange: "$",
                areaServed: {
                  "@type": "Country",
                  name: "Nepal"
                },
                serviceArea: {
                  "@type": "Country",
                  name: "Nepal"
                },
                hasOfferCatalog: {
                  "@type": "OfferCatalog",
                  name: "Hamro eShop Product Catalog",
                  itemListElement: [
                    {
                      "@type": "OfferCatalog",
                      name: "Electronics",
                      itemListElement: []
                    },
                    {
                      "@type": "OfferCatalog", 
                      name: "Fashion",
                      itemListElement: []
                    },
                    {
                      "@type": "OfferCatalog",
                      name: "Gadgets",
                      itemListElement: []
                    },
                    {
                      "@type": "OfferCatalog",
                      name: "Home Appliances",
                      itemListElement: []
                    }
                  ]
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://hamroeshop.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                },
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61576989100945",
                  "https://www.instagram.com/Hamro_e_shop"
                ]
              })
            }}
          />
          
          {/* Local Business structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "@id": "https://hamroeshop.com",
                name: "Hamro eShop",
                image: "https://hamroeshop.com/og.webp",
                url: "https://hamroeshop.com",
                telephone: "+977-9828086387",
                email: "service.eshopnepal@gmail.com",
                priceRange: "$",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "NP",
                  addressLocality: "Kathmandu",
                  addressRegion: "Bagmati"
                },
                geo: {
                  "@type": "GeoCoordinates",
                  latitude: 28.3949,
                  longitude: 84.1240
                },
                openingHoursSpecification: [
                  {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: [
                      "Monday",
                      "Tuesday", 
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday"
                    ],
                    opens: "09:00",
                    closes: "21:00"
                  }
                ],
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: "4.5",
                  reviewCount: "100",
                  bestRating: "5",
                  worstRating: "1"
                },
                review: {
                  "@type": "Review",
                  reviewRating: {
                    "@type": "Rating",
                    ratingValue: "5",
                    bestRating: "5"
                  },
                  author: {
                    "@type": "Person",
                    name: "Customer Review"
                  },
                  reviewBody: "Great online shopping experience with quality products and fast delivery."
                },
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61576989100945",
                  "https://www.instagram.com/Hamro_e_shop"
                ]
              })
            }}
          />
          
          {/* Organization structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Hamro eShop",
                url: "https://hamroeshop.com",
                logo: "https://hamroeshop.com/og.webp",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+977-9828086387",
                  email: "service.eshopnepal@gmail.com",
                  contactType: "customer service",
                  areaServed: "NP",
                  availableLanguage: ["English", "Nepali"]
                },
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "NP",
                  addressLocality: "Kathmandu",
                  addressRegion: "Bagmati"
                },
                foundingDate: "2024",
                numberOfEmployees: "10-50",
                slogan: "Quality Shopping Experience in Nepal",
                description: "Hamro eShop provides quality electronics, fashion, gadgets and home essentials with secure online shopping experience in Nepal."
              })
            }}
          />

          {/* Enhanced Breadcrumb structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://hamroeshop.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Electronics",
                    "item": "https://hamroeshop.com/electronics"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": "Fashion",
                    "item": "https://hamroeshop.com/fashion"
                  },
                  {
                    "@type": "ListItem",
                    "position": 4,
                    "name": "Gadgets",
                    "item": "https://hamroeshop.com/gadgets"
                  }
                ]
              })
            }}
          />

          {/* Site navigation structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SiteNavigationElement",
                "name": ["Home", "All Products", "Deals", "Contact"],
                "url": [
                  "https://hamroeshop.com",
                  "https://hamroeshop.com/all-products",
                  "https://hamroeshop.com/deals",
                  "https://hamroeshop.com/contact"
                ]
              })
            }}
          />

          {/* Favicon and manifest */}
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/site.webmanifest" />

          {/* Contact and verification meta */}
          <meta property="fb:page_id" content="61576989100945" />
          <meta property="og:see_also" content="https://www.facebook.com/profile.php?id=61576989100945" />
          <meta property="og:see_also" content="https://www.instagram.com/Hamro_e_shop" />
          
          {/* Search engine verification - Replace with actual codes */}
          <meta name="google-site-verification" content="your-google-verification-code" />
          <meta name="msvalidate.01" content="your-bing-verification-code" />
          <meta name="yandex-verification" content="your-yandex-verification-code" />
          <meta name="p:domain_verify" content="your-pinterest-verification-code" />
          
          {/* Additional meta for ecommerce */}
          <meta name="commerce" content="true" />
          <meta name="shopping" content="true" />
          <meta name="ecommerce" content="true" />
          <meta name="store" content="true" />
          <meta name="retail" content="true" />
          <meta name="marketplace" content="true" />
          <meta name="payment-methods" content="Credit Card, Debit Card, Online Banking, Cash on Delivery" />
          <meta name="shipping" content="Nationwide delivery in Nepal" />
          <meta name="return-policy" content="7-day return policy" />
          <meta name="customer-service" content="service.eshopnepal@gmail.com" />
          <meta name="business-hours" content="9:00 AM - 9:00 PM" />
          
          {/* Web app manifest and PWA */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-touch-fullscreen" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="application-name" content="Hamro eShop" />
          <meta name="msapplication-tooltip" content="Hamro eShop - Online Shopping Nepal" />
          <meta name="msapplication-starturl" content="/" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="full-screen" content="yes" />
          <meta name="browsermode" content="application" />
          
          {/* Security and privacy */}
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
          <meta httpEquiv="Cache-Control" content="max-age=31536000" />
          <meta httpEquiv="Expires" content="31536000" />

          {/* Alternate language tags (if you support Nepali) */}
          <link rel="alternate" href="https://hamroeshop.com" hrefLang="en-np" />
          <link rel="alternate" href="https://hamroeshop.com/np" hrefLang="ne-np" />

          {/* Twitter Card for e-commerce */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@hamroeshop" />
          <meta name="twitter:title" content="Hamro eShop - Best Online Shopping" />
          <meta name="twitter:description" content="Shop electronics, fashion, gadgets, and more at Hamro eShop. Fast delivery and exclusive deals for Nepal." />
          <meta name="twitter:image" content="https://hamroeshop.com/og.webp" />
        </head>
        <body className={`${outfit.className} antialiased text-gray-700`}>
          <Toaster />
          <AppContextProvider>
            {children}
            <MobileNavBar />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}