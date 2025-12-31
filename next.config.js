/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure file watching works properly
  webpack: (config, {dev}) => {
    if (dev) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300,
      };
    }
    return config;
  },
};

module.exports = nextConfig;

// const nextConfig = {
//   cacheHandler: require.resolve("./cache-handler.js"),
// };

// export default nextConfig;
// module.exports = CacheHandler;

// module.exports = () => ({
//   cacheHandler: require.resolve("./cache-handler.js"),
//   output: "standalone",
// });
