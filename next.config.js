// const nextConfig = {
//   cacheHandler: require.resolve("./cache-handler.js"),
// };

// export default nextConfig;
// module.exports = CacheHandler;

module.exports = () => ({
  cacheHandler: require.resolve("./cache-handler.js"),
});
