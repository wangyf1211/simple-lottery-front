module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      config.mode = "production";
      let optimization = {
        runtimeChunk: "single",
        splitChunks: {
          chunks: "all",
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                // npm package names are URL-safe, but some servers don't like @ symbols
                return `npm.${packageName.replace("@", "")}`;
              }
            }
          }
        }
      };
      Object.assign(config, {
        optimization
      });
    } else {
      config.mode = "development";
    }
  },
  productionSourceMap: false,
  devServer: {
    port: 8080,
    proxy: {
      "/api": {
        target: "http://localhost:8010/",
        changeOrigin: true
      }
    }
  }
};
