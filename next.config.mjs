/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para Render
  output: 'standalone',
  
  // Configuración de imágenes
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Configuración de PWA
  experimental: {
    appDir: true
  },
  
  // Configuración de TypeScript
  typescript: {
    ignoreBuildErrors: false
  },
  
  // Configuración de ESLint
  eslint: {
    ignoreDuringBuilds: false
  },
  
  // Configuración de trailing slash
  trailingSlash: false,
  
  // Configuración de base path
  basePath: '',
  
  // Configuración de asset prefix
  assetPrefix: '',
  
  // Configuración de webpack
  webpack: (config, { isServer }) => {
    // Configuración para archivos estáticos
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp)$/i,
      type: 'asset/resource'
    })
    
    return config
  }
}

export default nextConfig
