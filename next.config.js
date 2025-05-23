/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { isServer, dev }) {
    config.experiments = {
      syncWebAssembly: true, // Change to sync WebAssembly
      layers: true,
    };

    // Add a rule to process WASM files from node_modules
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async", // use 'async' for asyncWebAssembly
    });

    return config;
  },
  async redirects() {
    let redirects =
      process.env.WALLET_NETWORK !== "sbtcDevenv"
        ? [
            {
              source: "/transfer",
              destination: "/",
              permanent: false,
            },
          ]
        : [];

    return redirects;
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
