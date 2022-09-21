'use strict';
const path = require('path');
const pk = require('./package.json');

module.exports =
{
  devServer:
  {
    overlay:
    {
      errors: true,
      warnings: true
    },
    proxy:
      {
        '/api':
          {
            target: process.env.VUE_APP_API_URL,
            //pathRewrite: pathName => pathName.replace(/\/api/, ''),
            ws: true,
            changeOrigin: true,
            onProxyReq: proxyReq =>
            {
              proxyReq.setHeader('Origin', process.env.VUE_APP_API_URL);
            },
          },
      },
    clientLogLevel: 'info',
  },
  lintOnSave: process.env.NODE_ENV !== 'production' ? 'error' : false,
  css:
  {
    sourceMap: process.env.NODE_ENV === 'development',
    loaderOptions:
    {
      postcss:
      {
        config:
        {
          // without this Webpack complains that there is no PostCSS config inside the Vuetify/dist folder
          path: path.resolve(__dirname, '.postcssrc.js'),
        }
      },
    }
  },
  configureWebpack: config =>
  {
    let parent;
    let dir = path.resolve(__dirname);
    const parsed = path.parse(dir);
    while (parsed.root !== dir)
    {
      dir = path.dirname(dir);
      parent = dir + (parsed.root !== dir ? path.sep : '') + 'node_modules';
      config.resolve.modules.push(parent);
      config.resolveLoader.modules.push(parent);
    }

    config.devtool = process.env.NODE_ENV === 'development' ? 'inline-source-map' : false; // other modes often break hot-reload and/or breakpoints
    if (!config.performance) config.performance = {};
    config.performance.hints = false;
    config.optimization.runtimeChunk = 'single';
    config.optimization.moduleIds = 'hashed';
    config.optimization.splitChunks = {
      automaticNameDelimiter: '_',
      chunks: 'all',
      maxInitialRequests: 5,
      minSize: 5000,
      // maxSize: 250000,
      cacheGroups:
      {
        default:
        {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        vendor:
        {
          reuseExistingChunk: true,
          test: /[\\/]node_modules[\\/]/,
          name(module)
          {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendors_${packageName.replace('@', '')}`;
          },
        },
      },
    };
  },
  chainWebpack: config =>
  {
    config.resolve.symlinks(false);
    config.resolve.alias.set('src', path.resolve(__dirname, 'src'));
    if (process.env.NODE_ENV === 'development')
    {
      config.module.rule('eslint').use('eslint-loader').loader('eslint-loader').tap(options =>
      {
        delete options.cacheIdentifier;
        options.cache = false; // otherwise on each restart cached errors won't be shown !!!
        return options;
      });
    }
    config.module.rule('vue').use('vue-loader').loader('vue-loader').tap(options =>
    {
      delete options.cacheDirectory;
      return options;
    });
    config.module.rule('vue').uses.delete('cache-loader');
    config.module.rule('js').uses.delete('cache-loader');
    //config.plugins.delete('prefetch'); // for async routes
    //config.plugins.delete('preload'); // for CSS

    // condense whitespace in templates
    config.module.rule('vue').use('vue-loader').tap(options =>
    {
      options.compilerOptions = { whitespace: 'condense' };
      return options;
    });

    // plugin options must be wrapped inside Array - otherwise error "non-callable @@iterator"
    if (process.env.NODE_ENV === 'development')
    {
      config.plugin('stylelintVue')
        .use(require('stylelint-webpack-plugin'),
          [
            {
              context: path.resolve(__dirname, 'src'),
              configFile: path.resolve(__dirname, 'stylelint.config.js'),
              files: '**/*.{vue,css,scss}',
              globbyOptions: { extension: false }, // IVO GELOV - otherwise "fastGlob" does not find anything if the folder contains brace(s)
              quiet: false,
              emitErrors: true
            }
          ]);
    }

    config.plugin('define')
      .tap(args =>
      {
        args[0]['process.env'].BUILD_TIME = JSON.stringify((new Date()).toISOString());
        args[0]['process.env'].VERSION = JSON.stringify(pk.version);
        return args;
      });
    return config;
  }
};
