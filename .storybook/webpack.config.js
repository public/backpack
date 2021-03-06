const fs = require('fs');
const path = require('path');

const sassFunctions = require('./../packages/bpk-mixins/sass-functions');
const postCssPlugins = require('./../scripts/webpack/postCssPlugins');

const { BPK_TOKENS, ENABLE_CSS_MODULES } = process.env;
const rootDir = path.resolve(__dirname, '../');
const useCssModules = ENABLE_CSS_MODULES !== 'false';

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!bpk-).*/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { browsers: ['ie >= 11'] },
              },
            ],
          ],
        },
      },
      {
        test: /\.css/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: useCssModules,
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCssPlugins,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: useCssModules,
              localIdentName: '[local]-[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCssPlugins,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              prependData: BPK_TOKENS
                ? fs.readFileSync(
                    path.join(
                      rootDir,
                      `packages/bpk-tokens/tokens/${BPK_TOKENS}.scss`,
                    ),
                  )
                : '',
              sassOptions: {
                functions: sassFunctions,
              },
            },
          },
        ],
      },
    ],
  },
};
