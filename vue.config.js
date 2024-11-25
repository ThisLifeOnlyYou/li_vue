const path = require('path');
module.exports = {
    lintOnSave: false,
    publicPath:process.env["VITE_APP_ENV "]==='production' ? '.' : '/',
    configureWebpack: {
        resolve: {
            alias: {
                '~': path.resolve(__dirname, './'),
                '@': path.resolve(__dirname, './src')
            },
            extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
        }
    },
    devServer: {
        port: 8000,
        host: '0.0.0.0', // 使得服务器可以外部访问
        open: false,
        proxy: {
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
            }
        }
    },
};
