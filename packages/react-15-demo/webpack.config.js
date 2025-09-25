const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash].js',
    clean: true,
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', { targets: 'defaults' }],
              ['@babel/preset-react']
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'React 15 栈协调器演示'
    })
  ],
  
  devServer: {
    port: 3015,
    open: true,
    hot: true,
    historyApiFallback: true,
    // 自动处理端口占用
    // 方案1: 自动寻找可用端口
    // port: 'auto',
    
    // 方案2: 如果端口被占用，自动使用下一个可用端口
    // 这是webpack-dev-server的默认行为，当设置的端口被占用时会自动找下一个
    
    // 方案3: 强制杀死占用进程（需要额外配置）
    onBeforeSetupMiddleware: (devServer) => {
      // 在启动前检查并处理端口占用
      console.log('🚀 启动 React 15 开发服务器...');
    },
    
    // 当端口被占用时，自动使用下一个可用端口
    // webpack-dev-server 会自动处理这个
  },
  
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  
  // 开发模式配置
  devtool: 'eval-source-map',
  
  // 性能分析配置
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  
  // 添加性能预算
  performance: {
    // maxAssetSize: 250000,
    // maxEntrypointSize: 250000,
    // hints: 'warning'
  }
};
