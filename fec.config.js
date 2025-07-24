module.exports = {
  appUrl: '/subscriptions/cloud-inventory',
  debug: true,
  useProxy: true,
  proxyVerbose: true,
  sassPrefix: '.cloud-inventory, .cloudInventory',
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  hotReload: process.env.HOT === 'true',
  moduleFederation: {
    exclude: ['react-router-dom'],
    shared: [
      {
        'react-router-dom': {
          singleton: true,
          import: false,
          version: '^6.3.0',
        },
      },
    ],
  },
};
