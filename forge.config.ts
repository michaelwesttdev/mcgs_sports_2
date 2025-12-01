import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { PublisherGithub } from "@electron-forge/publisher-github";
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import { FuseV1Options, FuseVersion } from '@electron/fuses';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: "./logo.ico",
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({
      name: "MCGSSports",
      setupIcon: "./logo.ico",
      certificateFile: "./cert",
    }),
    new MakerZIP({}, ['darwin']),
    new MakerRpm({}),
    new MakerDeb({}),
  ],
  publishers: [
    /* 
    new PublisherERS({
      baseUrl: "http://mcsdata.local:8080",
      username: "itadmin",
      password: "Ict@Mcs", // string
    }), */
    new PublisherGithub({
      authToken: process.env.GH_TOKEN,
      repository: {
        owner: "michaelwesttdev",
        name: "mcgsSports_update",
      },
      generateReleaseNotes: true,
    }),
  ],
  plugins: [ 
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/main/index.html',
            js: './src/main/renderer.ts',
            name: 'main_window',
            preload: {
              js: './src/main/preload.ts',
            },
          },
        ],
      },
    }),
    // Fuses are used to enable/disable various Electron functionality
    // at package time, before code signing the application
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
};

export default config;
