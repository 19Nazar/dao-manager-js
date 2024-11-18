// next.config.js
const path = require("path");

module.exports = {
  experimental: {
    middlewarePrefetch: true, // Убедитесь, что включена предварительная загрузка middleware
  },
};
