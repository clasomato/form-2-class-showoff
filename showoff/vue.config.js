// vue.config.js
module.exports = {
  configureWebpack: config => {
    node: {
        fs: "empty"
    }
    if (process.env.NODE_ENV === 'production') {
      // mutate config for production...
    } else {
      // mutate for development...
    }
  }
}
