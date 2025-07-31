/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para Render (plan gratuito)
  experimental: {
    optimizeCss: false,
    optimizePackageImports: false,
  },
  
  // Deshabilitar source maps para reducir memoria
  productionBrowserSourceMaps: false,
  
  // Optimizar imágenes
  images: {
    unoptimized: true, // Deshabilitar optimización de imágenes para ahorrar memoria
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  
  // Configuración de compilación
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimizar webpack
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Optimizaciones para producción
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
          },
        },
      };
    }
    
    return config;
  },
  
  // Configuración de PWA
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de base path
  basePath: '',
  
  // Configuración de asset prefix
  assetPrefix: '',
  
  // Configuración de distDir
  distDir: '.next',
  
  // Configuración de generateEtags
  generateEtags: false,
  
  // Configuración de poweredByHeader
  poweredByHeader: false,
  
  // Configuración de reactStrictMode
  reactStrictMode: true,
  
  // Configuración de swcMinify
  swcMinify: true,
};

export default nextConfig;
