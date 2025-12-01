import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const assets = [ 'assets', ];

export const plugins = [
  new ForkTsCheckerWebpackPlugin({
    logger: 'webpack-infrastructure',
  }),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, "src/db/sqlite/main/drizzle"), // Adjust the source path
        to: path.resolve(__dirname, ".webpack/main/main/drizzle"), // Adjust the output path
      },
      {
        from: path.resolve(__dirname, "src/db/sqlite/p_sports/drizzle"), // Adjust the source path
        to: path.resolve(__dirname, ".webpack/main/p_sports/drizzle"), // Adjust the output path
      },
      {
        from: path.resolve(__dirname, "src/db/sqlite/t_sports/drizzle"), // Adjust the source path
        to: path.resolve(__dirname, ".webpack/main/t_sports/drizzle"), // Adjust the output path
      },
      {
        from: path.resolve(__dirname, "src/db/sqlite/tournaments/drizzle"), // Adjust the source path
        to: path.resolve(__dirname, ".webpack/main/tournaments/drizzle"), // Adjust the output path
      },
    ],
  }),
  ...assets.map(asset=>(
    new CopyWebpackPlugin({
      patterns:[
        {
        from: path.resolve(__dirname, 'src', asset),
        to: path.resolve(__dirname, '.webpack/renderer', asset)
      }
      ]
    })
  ))
];
