// components/Analytics.tsx
'use client';
import React from 'react';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Replace with your actual Google Analytics ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

// TypeScript interfaces
interface EcommerceItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface WebVitalsMetric {
  name: string;
  id: string;
  value: number;
}

interface WebVitals {
  getCLS: (callback: (metric: WebVitalsMetric) => void) => void;
  getFID: (callback: (metric: WebVitalsMetric) => void) => void;
  getFCP: (callback: (metric: WebVitalsMetric) => void) => void;
  getLCP: (callback: (metric: WebVitalsMetric) => void) => void;
  getTTFB: (callback: (metric: WebVitalsMetric) => void) => void;
}

// Extend Window interface to include gtag and other properties
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
    webVitals?: WebVitals;
  }
}

// Helper function to safely access window properties
const getWindow = (): Window | {} => {
  if (typeof window !== 'undefined') {
    return window;
  }
  return {};
};

export function Analytics(): null {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    const win = getWindow() as Window;
    win.dataLayer = win.dataLayer || [];
    function gtag(...args: any[]): void {
      win.dataLayer.push(args);
    }
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
      custom_map: {
        custom_parameter_1: 'ecommerce_category',
        custom_parameter_2: 'user_type',
      },
    });

    // Make gtag globally available
    win.gtag = gtag;
  }, []);

  useEffect(() => {
    // Track page views
    const win = getWindow() as Window;
    if (win.gtag) {
      win.gtag('config', GA_MEASUREMENT_ID, {
        page_path: pathname,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

// Hook for tracking events
export function useAnalytics() {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ): void => {
    const win = getWindow() as Window;
    if (win.gtag) {
      win.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  const trackEcommerce = (action: string, items: EcommerceItem[]): void => {
    const win = getWindow() as Window;
    if (win.gtag) {
      win.gtag('event', action, {
        currency: 'NPR',
        value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }
  };

  const trackPurchase = (transactionId: string, items: EcommerceItem[]): void => {
    const win = getWindow() as Window;
    if (win.gtag) {
      win.gtag('event', 'purchase', {
        transaction_id: transactionId,
        currency: 'NPR',
        value: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        items: items.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: item.category,
          quantity: item.quantity,
          price: item.price,
        })),
      });
    }
  };

  return {
    trackEvent,
    trackEcommerce,
    trackPurchase,
  };
}

// Performance monitoring
export function PerformanceMonitor(): null {
  useEffect(() => {
    // Core Web Vitals tracking
    if (typeof window !== 'undefined' && window.webVitals) {
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = window.webVitals;
      
      function sendToAnalytics(metric: WebVitalsMetric): void {
        if (window.gtag) {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            event_label: metric.id,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            non_interaction: true,
          });
        }
      }

      getCLS(sendToAnalytics);
      getFID(sendToAnalytics);
      getFCP(sendToAnalytics);
      getLCP(sendToAnalytics);
      getTTFB(sendToAnalytics);
    }

    // Performance observer for page load metrics
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            // Cast to navigation timing entry
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.fetchStart;
            if (window.gtag) {
              window.gtag('event', 'page_load_time', {
                event_category: 'Performance',
                event_label: 'Total Load Time',
                value: Math.round(loadTime),
              });
            }
          }
        }
      });
      
      observer.observe({ entryTypes: ['navigation'] });
    }
  }, []);

  return null;
}

// Error tracking
export function ErrorTracker(): null {
  useEffect(() => {
    const handleError = (error: ErrorEvent): void => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: error.message,
          fatal: false,
        });
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
      if (window.gtag) {
        window.gtag('event', 'exception', {
          description: event.reason,
          fatal: false,
        });
      }
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}