const withCSS = require("@zeit/next-css");

module.exports = withCSS({
  publicRuntimeConfig: {
    APP_NAME: "UserBlog",
    API_PRODUCTION: "https://userblog.com",
    API_DEVELOPMENT: "http://localhost:8000/api",
    PRODUCTION: false,
  }
});