interface Window {
  dataLayer: any[];
  gtag: (...args: any[]) => void;
  webVitals?: {
    getCLS: (callback: (metric: any) => void) => void;
    getFID: (callback: (metric: any) => void) => void;
    getFCP: (callback: (metric: any) => void) => void;
    getLCP: (callback: (metric: any) => void) => void;
    getTTFB: (callback: (metric: any) => void) => void;
  };
}
