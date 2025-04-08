module.exports = {
  appUrl: "/subscriptions/cloud-inventory",
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  sassPrefix: ".cloud-inventory, .cloudInventory",
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  _unstableHotReload: process.env.HOT === "true",
  moduleFederation: {
    exclude: ["react-router-dom"],
    shared: [
      {
        "react-router-dom": {
          singleton: true,
          import: false,
          version: "^6.3.0",
        },
      },
    ],
  },
};
