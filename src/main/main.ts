import { BrowserWindow, ipcMain, Menu } from "electron";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";
import log from "electron-log";
import { getLoggingUrl, getMainDbUrl } from "@/shared/helpers/urls";
import { MainConfig } from "@/shared/types/electron.main";
import { initDb } from "@/db/sqlite";
import * as MainSchema from "@/db/sqlite/main/schema";
import { MainDBContext } from "@/db/contexts/main.db.context";
import { MainHandler } from "./handlers/mainHandler";

export class Main {
  private window: Electron.BrowserWindow;
  private app: Electron.App;
  private preload: string;
  private webpackEntry: string;
  private log: log.MainLogger & { default: log.MainLogger };

  constructor(app: Electron.App, config: MainConfig) {
    this.app = app;
    this.preload = config.preloadUrl;
    this.webpackEntry = config.webpackEntry;
    this.log = log;
    this.log.transports.file.resolvePathFn = () => getLoggingUrl("main.log");
  }
  init(): void {
    this.registerHandlers();
  }
  private createWindow(): void {
    this.window = new BrowserWindow({
      height: 600,
      width: 1200,
      minHeight: 600,
      minWidth: 800,
      titleBarStyle: "hidden",
      titleBarOverlay: false,
      frame: false,
      webPreferences: {
        preload: this.preload,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });
    this.window.loadURL(this.webpackEntry);
    this.window.on("closed", () => {
      this.window = null;
    });
    this.createMenu();
    process.env.NODE_ENV !== "production" &&
      this.window.webContents.openDevTools();
  }
  private createMenu(): void {
    const menu = Menu.buildFromTemplate([]);
    Menu.setApplicationMenu(menu);
  }
  private registerHandlers(): void {
    this.registerAppHandlers();
    this.registerIpcHandlers();
  }
  private registerIpcHandlers(): void {
    ipcMain.on("close", async () => {
      this.window.close();
    });
    ipcMain.on("win:minimize", async () => {
      this.window.minimize();
    });
    ipcMain.on("win:maximize", async () => {
      this.window.maximize();
    });
    ipcMain.on("win:restore", async () => {
      this.window.restore();
    });
    
    /* main handlers */
    const db = initDb({
      schema:MainSchema, 
      dbPath: getMainDbUrl(),
      migrate: true,
    });
    const mainDbContext = new MainDBContext(db);
    const mainHandler = new MainHandler(mainDbContext);
    mainHandler.registerMainHandlers();
    
    //List of printers
    ipcMain.handle("printer:list", async(_,args)=>{
     try {
       const printers = await this.window.webContents.getPrintersAsync();
       return {data:printers,success:true};
     } catch (error) {
      return {success:false,error}
     }
    })
  }

  private registerAppHandlers(): void {
    this.app.setAppUserModelId("com.squirrel.MCGSSports.MCGSSports");

    this.app.on("ready", () => {      
      this.createWindow();
      this.handleUpdates();
    });

    this.app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        this.app.quit();
      }
    });

    this.app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
        this.handleUpdates();
      }
    });
  }
  private handleUpdates(): void {
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: "michaelwesttdev/mcgsSports_update",
      },
      updateInterval: "1 hour",
      logger: this.log,
    });
  }
}
