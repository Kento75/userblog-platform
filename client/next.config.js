const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "UserBlog",
    API_PRODUCTION: "https://userblog.com",
    API_DEVELOPMENT: "http://localhost:8000/api",
    PRODUCTION: false,
    DOMAIN_DEVELOPMENT: "http://localhost:3000",
    DOMAIN_PRODUCTION: "https://userblog.com",
    FB_APP_ID: "", // 僕は使わない FacebookのAPP_ID
    DISQUS_SHORTNAME: 'userblog-1',
  }
});