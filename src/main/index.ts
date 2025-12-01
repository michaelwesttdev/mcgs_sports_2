import { app } from "electron";
import { Main } from "./main";
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;
if (require("electron-squirrel-startup")) {
  app.quit();
}

const main = new Main(app, {
  preloadUrl: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
  webpackEntry: MAIN_WINDOW_WEBPACK_ENTRY,
});

main.init();
