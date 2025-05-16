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
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });
    // Add support for importing worker files
    config.module.rules.push({
      test: /firebase-messaging-sw\.js$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            publicPath: '/_next',
          },
        },
      ],
    });
    return config;
  },
  experimental: {
    serverActions: true,
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
      },
      {
        protocol: 'https',
        hostname: 'sdmntprpolandcentral.oaiusercontent.com',
      }
    ]
  },
  // Ensure consistency in package resolutions for Firebase
  transpilePackages: ['@firebase/firestore'],
  async headers() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/firebase-messaging-sw.js',
        destination: '/api/firebase-messaging-sw',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_VAPID_KEY: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  },
};

module.exports = nextConfig; 