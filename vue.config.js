const path = require('path');
const webpack = require('webpack');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
const nodeExternals = require('webpack-node-externals');
const package = require('./package');

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

module.exports = {
  publicPath: './',
  // outputDir: process.env.VUE_APP_OUTPUTDIR,
  pages: {
    index: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      // filename: 'index.html'
    },
    // todo: preload 以及html plugin配置完善，去除多余chunk
    static: {
      entry: 'src/static.ts',
      template: 'src/template/static.html',
      filename: 'ai-rules.html',
      chunks: ['static']
    },
    active: {
      entry: 'src/package/active.ts',
      template: 'src/template/active.html',
      filename: 'active.html',
      // chunks: ['active']
    },
    activeH5: {
      entry: 'src/package/activeH5.ts',
      template: 'src/template/activeH5.html',
      filename: 'activeH5.html'
    },
    editorPreview: {
      entry: 'src/packages/editor-preview/main.ts',
      template: 'src/packages/editor-preview/index.html',
      filename: 'editor-preview.html',
      // chunks: ['editorPreview']
    }
  },

  configureWebpack: (config) => {
    // console.log(config.optimization);
    return {
      resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
          '@': resolve('src'),
          'vue$': 'vue/dist/vue.esm.js',
          'components': resolve('src/components'),
          'config': resolve('src/config'),
          'directives': resolve('src/directives'),
          'mock': resolve('src/mock'),
          'modules': resolve('src/modules'),
          'plugins': resolve('src/plugins'),
          'routes': resolve('src/routes'),
          'service': resolve('src/service'),
          'utils': resolve('src/utils'),
          'views': resolve('src/views'),
          'packages': resolve('packages')
          // "scss": resolve('src/packages/theme-chalk/src/common')
        }
      },
      plugins: [
        new CompressionWebpackPlugin({
          algorithm: 'gzip',
          test: new RegExp(
            '\\.(' +
            productionGzipExtensions.join('|') +
            ')$'
          ),
          threshold: 10240,
          minRatio: 0.8
        }),
        new webpack.ProvidePlugin({
          katex: 'katex'
        }),
        // new webpack.DefinePlugin({
        //   'process.env': {
        //     APPID: JSON.stringify('10846'),
        //     APPVERSION: JSON.stringify(package.version)
        //   }
        // })
      ],
      externals: process.env.NODE_ENV === 'test' ? [nodeExternals()] : {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'axios': 'axios'
      }
      // externals: process.env.NODE_ENV === 'test' ? [nodeExternals()] : {}
    }
  },

  devServer: {
    clientLogLevel: 'warning',
    compress: true,
    // contentBase: false, // since we use CopyWebpackPlugin.
    // host: '192.168.6.40',
    hot: true,
    open: true,
    openPage: '',
    port: '8888',
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true
    },
    proxy: {
      '/kidsStuApi': {
        target: process.env.VUE_APP_PROXY_PARTNER,
        changeOrigin: true
      },
      '/kidsPadApi': {
        target: process.env.VUE_APP_PROXY_KIDSPADAPI,
        changeOrigin: true
      },
      '/eduLesson': {                                                                      // 小班课测评课课程报告代理
        target: process.env.VUE_APP_PROXY_EDULESSON,
        changeOrigin: true
      },
      '/test/lessonReport': {                                                              // 1对1测评课课程报告代理
        target: process.env.VUE_APP_PROXY_TEST_LESSON_REPORT,
        changeOrigin: true
      },
      '/kids/': {
        target: process.env.VUE_APP_GATEWAY,                                               // 少儿网关 代理：测评报告 pad阶段测评报告
        changeOrigin: true
      },
      '/courseware': {
        target: process.env.VUE_APP_PROXY_COURSEWARE,
        changeOrigin: true
      },
      '/log': {
        target: process.env.VUE_APP_PROXY_LOG,
        changeOrigin: true
      },
      '/app-resources': {
        target: process.env.VUE_APP_GATEWAY,
        changeOrigin: true
      }
    },
  },

  css: {
    loaderOptions: {
      sass: {
        data: '@import "@/assets/scss/common/var.scss";'
      },
      postcss: {
        ident: 'postcss',
        plugins: [
          require('postcss-pxtorem')({
            rootValue: 51.2,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: ['tips-for-remedial-classes', /pad-active/, '#app', /pad-editor/]
          })
        ]
      }
    }
  },

  chainWebpack: config => {
    console.log(config.optimization);
    config.optimization.splitChunks({
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          minChunks: 3,
          test: /node_modules/,
          priority: -10,
          chunks: 'initial'
        },
        common: {}
      }
    });
    config.plugin('fork-ts-checker').tap(([options]) => {
      return [{
        async: false,
        tslint: true,
        vue: true
      }]
    });
    config.module
      .rule('svga')
      .test(/\.svga$/)
      .use('file-loader')
      .loader('file-loader')
      .end();
    config.plugin('define')
      .tap(args => {
        return [{
          'process.env': Object.assign(args[0]['process.env'], {
            APP_VERSION: `"${package.version}"`,
            APP_ID: package.appid
          })
        }];
      });
    config.plugin('preload-static')
      .tap(args => {
        args[0].fileBlacklist.push(/chunk-vendors/);
        return args;
      });
    config.plugin('preload-active')
      .tap(args => {
        args[0].fileBlacklist.push(/chunk-vendors/);
        return args;
      });
    config.plugin('preload-editorPreview')
      .tap(args => {
        args[0].fileBlacklist.push(/chunk-vendors/);
        return args;
      })
    // config.plugin('preload')
  }
};
