module.exports = {
  devServer: {
    port: 8460,
    proxy: {
      '/api': {
        target: 'http://localhost:8360',
        ws: true,
        changeOrigin: true
      },
      '/socket.io': {
        target: 'http://localhost:8360',
        ws: true,
        changeOrigin: true
      }
    }
  }
}