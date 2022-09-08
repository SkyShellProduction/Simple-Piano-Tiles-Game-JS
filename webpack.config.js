const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const PATHS = {
    src: path.join(__dirname, './src'),
    dist: path.join(__dirname, './dist'),
    assets: 'assets/'
};
module.exports = {
   entry: {
        app: path.resolve(__dirname, PATHS.src),
   },
   output: {
      filename: `${PATHS.assets}js/[name].js`,
      path: path.resolve(__dirname, PATHS.dist),
      publicPath: '/'
   },
   mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
   devtool: 'inline-source-map',
   devServer: {
      port: 'auto',
      static: {
          directory: path.join(__dirname, './src'),
          watch: true
      },
      compress: true,
      liveReload: true,
      historyApiFallback: {
         disableDotRule: true,
       },
      client: {
          overlay: {
              errors: true,
              warnings: false,
         },
      },
     
   },
   optimization: {
      splitChunks: {
         cacheGroups: {
            defaultVendors: {
               filename: `${PATHS.assets}js/vendors.js`,
               test: /node_modules/,
               chunks: 'all'
            }
         }
      }
   },
   module: {
      rules: [
         {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
         },
         {
            test: /\.(scss|css)$/,
            use: [
               "style-loader",
               MiniCssExtractPlugin.loader,
               {
                  loader: "css-loader",
                  options: {
                     modules: {
                        mode: 'global'
                     },
                     esModule: false
                  }
               },
               "postcss-loader",
               "sass-loader"
            ]
         },
         {
            test: /\.(png|jpg|webp|jpeg|gif|svg)$/,
            use: [
               {
                  loader: 'file-loader',
                  options: {
                     name: '[name].[ext]',
                     esModule: false,
                     outputPath: `${PATHS.assets}img/`
                  }
               }
            ]
         },
         {
            test: /\.(woff(2)?|ttf|eot|svg)$/,
            loader: 'file-loader',
            options: {
               name: '[name].[ext]',
               outputPath: `${PATHS.assets}fonts/`
            }
         }
      ]
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: `${PATHS.assets}css/[name].css`
      }),
      new HtmlWebpackPlugin({
         template: `${PATHS.src}/html/index.html`,
         filename: `index.html`,
         scriptLoading: 'blocking'
      }),
      new CopyPlugin({
         patterns: [
            {
               from: `${PATHS.src}/assets/img`,
               to: `${PATHS.assets}img`,
               noErrorOnMissing: true,
            },
            {
               from: `${PATHS.src}/assets/fonts`,
               to: `${PATHS.assets}fonts`,
               noErrorOnMissing: true,
            },
            {
               from: `${PATHS.src}/static`,
               to: ``,
               noErrorOnMissing: true,
            },
         ]
      })
   ]
}
console.log(process.env.NODE_ENV);