import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
import path from "path";

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader', options:{importLoaders:1} },{ loader: "postcss-loader" },],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins,
  resolve: {
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.resolve(__dirname, "tsconfig.json"),
      }),
    ],
    fallback: {
      crypto: false,
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
