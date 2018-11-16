'use strict'//js严格模式执行
const utils = require('./utils')//导入utils.js
const webpack = require('webpack')//使用webpack来使用webpack内置插件
const config = require('../config')//引入config文件夹下的index.js文件
const merge = require('webpack-merge')//引入webpack-merge插件用来合并webpack配置对象，也就是说可以把webpack配置文件拆分成几个小的模块，然后合并
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')//导入webpack基本配置
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')//生成html文件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')//获取port

const HOST = process.env.HOST//process.env属性返回一个对象，包含了当前shell的所有环境变量。这句取其中的host文件？
const PORT = process.env.PORT && Number(process.env.PORT)//获取所有环境变量下的端口？

//合并模块，第一个参数是webpack基本配置文件webpack.base.conf.js中的配置
const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })//创建模块时匹配请求的规则数组,这里调用了utils中的配置模板styleLoaders
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,//debtool是开发工具选项，用来指定如何生成sourcemap文件，cheap-module-eval-source-map此款soucemap文件性价比最高

  // these devServer options should be customized in /config/index.js
  devServer: {//webpack服务器配置
    clientLogLevel: 'warning',//使用内联模式时，在开发工具的控制台将显示消息，可取的值有none error warning info
    historyApiFallback: {//当使用h5 history api时，任意的404响应都可能需要被替代为index.html，通过historyApiFallback：true控制；通过传入一个对象，比如使用rewrites这个选项进一步控制
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({//模块HtmlWebpackPlugin
      filename: 'index.html',//生成的文件的名称
      template: 'index.html',//可以指定模块html文件
      inject: true//在文档上没查到这个选项 不知道干嘛的。。。
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
