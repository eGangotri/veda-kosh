const nextConfig = {
  experimental: {
    turbo:{},
    appDir: true  // Enable App Router
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    });
    return config;
  },
};

module.exports = nextConfig;
