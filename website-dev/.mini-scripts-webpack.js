module.exports = {
  resolve: {
    alias: {
      '@deer-ui/admin-scaffold': path.resolve(__dirname, "../src"),
    },
    modules: [
      path.resolve(__dirname, "../node_modules"),
      path.resolve(__dirname, "../src"),
      "node_modules"
    ],
  },
}
