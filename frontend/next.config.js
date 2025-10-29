/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ignore optional dependencies warnings
    config.ignoreWarnings = [
      { module: /@react-native-async-storage/ },
      { module: /pino-pretty/ },
    ];
    
    return config;
  },
};

module.exports = nextConfig;
