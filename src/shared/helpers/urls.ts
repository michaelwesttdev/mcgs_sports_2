import { app } from "electron";
import path from "path";
import fs from "fs";
export function getLoggingUrl(fileName: string): string {
  return "./logs/" + fileName;
}
export function getMainDbUrl(): string {
  const base = getAppStoreBaseUrl();
  const mainDbPath = path.join(base, "main.db");
  return mainDbPath;
}
export function getSessionDbFolderUrl(): string {
  const base = getAppStoreBaseUrl();
  const sessionsPath = path.join(base, "sessions");
  if (!fs.existsSync(sessionsPath)) {
    fs.mkdirSync(sessionsPath, { recursive: true });
  }
  return sessionsPath;
}
export function getSettingsFileUrl(): string {
  const base = getAppStoreBaseUrl();
  const settingsPath = path.join(base, `settings.json`);
  return settingsPath;
}
export function getSessionSettingsFileUrl(sessionId:string): string {
  const base = getSessionDbFolderUrl();
  const sessionSettingsPath = path.join(base,"settings");
  if(!fs.existsSync(sessionSettingsPath)) {
    fs.mkdirSync(sessionSettingsPath, { recursive: true });
  }
  const settingsPath = path.join(sessionSettingsPath, `${sessionId}_settings.json`);
  return settingsPath;
}
export function getSessionDbPath(id: string) {
  const basePath = getSessionDbFolderUrl();
  const SessionDbPath = path.join(basePath, `${id}.db`);
  return SessionDbPath;
}

export function getAppStoreBaseUrl(): string {
  const docsPath = app.getPath("appData");
  const appStorePath = path.join(docsPath, "mcgsStore", "sports");
  if (!fs.existsSync(appStorePath)) {
    fs.mkdirSync(appStorePath, { recursive: true });
  }
  return appStorePath;
}
