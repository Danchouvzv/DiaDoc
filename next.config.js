/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle Node.js specific modules for browser environment
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        net: false,
        tls: false,
        fs: false,
        perf_hooks: false,
        child_process: false,
        os: false,
        path: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        'node:fs': false,
        'node:net': false,
        'node:perf_hooks': false,
        'node:crypto': false,
        'node:stream': false,
        'node:http': false,
        'node:https': false,
        'node:zlib': false,
        'node:path': false,
        'node:os': false,
        'node:process': false,
        'node:util': false,
      };
    }
    return config;
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:9008', '192.168.0.102:9008']
    }
  },
  serverExternalPackages: [
    '@opentelemetry/api',
    '@opentelemetry/context-async-hooks',
    '@opentelemetry/sdk-trace-node',
    '@grpc/grpc-js',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      }
    ]
  },
  // Ensure consistency in package resolutions for Firebase
  transpilePackages: ['@firebase/firestore'],
};

module.exports = nextConfig; 