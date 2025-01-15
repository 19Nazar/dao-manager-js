// next.config.js
const path = require("path");

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      include: /node_modules\/dao-manager-js/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env", "@babel/preset-typescript"],
        },
      },
    });
    return config;
  },
};
