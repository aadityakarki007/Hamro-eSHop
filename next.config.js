/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Compress responses
  compress: true,
  
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  
  // Image optimization
  images: {
    // Enable modern image formats
    formats: ['image/webp', 'image/avif'],
    
    // Define device sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    
    // Define image sizes for different layouts
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Configure image domains (add your CDN/external image sources)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hamroeshop.com',
      },
      {
        protocol: 'https',
        hostname: 'www.hamroeshop.com',
      },
      // Add other domains where you host images
    ],
    
    // Disable static imports optimization if needed
    // dangerouslyAllowSVG: true,
    // contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Security headers
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Performance headers
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  
  // Redirects (add any URL redirects you need)
  async redirects() {
    return [
      // Example: Redirect old URLs to new ones
      {
        source: '/shop',
        destination: '/all-products',
        permanent: true,
      },
      {
        source: '/products',
        destination: '/all-products',
        permanent: true,
      },
      // Add more redirects as needed
    ];
  },
  
  // Rewrites for clean URLs
  async rewrites() {
    return [
      // Example: API routes
      {
        source: '/api/products/:path*',
        destination: '/api/products/:path*',
      },
    ];
  },
  
  // Compiler options
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
    
    // Enable relay compiler if you use it
    // relay: {
    //   src: './',
    //   artifactDirectory: './__generated__',
    //   language: 'typescript',
    // },
  },
  
  // PWA configuration (if you're using next-pwa)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
  
  // Bundle analyzer (uncomment to analyze bundle size)
  // bundleAnalyzer: {
  //   enabled: process.env.ANALYZE === 'true',
  // },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      };
    }
    
    return config;
  },
  
  // Output configuration
  output: 'standalone', // For Docker deployments
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Standalone output for deployment
  trailingSlash: false,
  
  // Enable static exports if needed
  // output: 'export',
};

module.exports = nextConfig;