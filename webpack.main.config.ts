import type { Configuration } from 'webpack';

import { rules } from './webpack.rules';
import { plugins } from './webpack.plugins';
import TsconfigPathsPlugin from "tsconfig-paths-webpack-plugin";
import path from "path";

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
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
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
};
