import { ipcRenderer } from "electron";
import { api as apiExtention } from "./handlers/rendererHandler";
import {PSessionSettings, Settings, TournamentSessionSettings, TSessionSettings} from "@/shared/settings";
import { FetchSessionSettingsArgs, UpdateSessionSettingsArgs } from "@/shared/types/api";

function getVersion() {
  ipcRenderer.invoke("app:version");
}
function getSettings(args:FetchSessionSettingsArgs) {
  return ipcRenderer.invoke("getSettings",args);
}
function updateSettings(args:UpdateSessionSettingsArgs) {
  return ipcRenderer.invoke("updateSettings", args);
}
function handleClose() {
  ipcRenderer.send("close");
}
function handleMinimize() {
  ipcRenderer.send("win:minimize");
}
function handleMaximise() {
  ipcRenderer.send("win:maximize");
}
function handleRestore() {
  ipcRenderer.send("win:restore");
}
async function handleSessionDbCreate(id: string,sessionType:"team"|"performance"|"tournament") {
  return await ipcRenderer.invoke("session:createDbContext", {sessionId:id,sessionType});
}
async function handleSessionDbClose(id: string) {
  return await ipcRenderer.invoke("session:closeDbContext", id);
}
async function handleSessionSettingsContextCreate(defaults:PSessionSettings|TSessionSettings|TournamentSessionSettings,id: string) {
  return await ipcRenderer.invoke("settings:createSettingsContext", {defaults,sessionId:id});
}
async function handleSessionSettingsContextClose(id: string) {
  return await ipcRenderer.invoke("settings:closeSettingsContext", id);
}
async function getPrinterList(){
  return await ipcRenderer.invoke("printer:list")
}
async function exportCSV(args: { data: string,filename:string }) {
  return await ipcRenderer.invoke("export:csv", args);
}

const api = {
  getVersion,
  getSettings,
  updateSettings,
  handleClose,
  handleMinimize,
  handleMaximise,
  handleRestore,
  handleSessionDbCreate,
  handleSessionDbClose,
  handleSessionSettingsContextCreate,
  handleSessionSettingsContextClose,
  getPrinterList,
  printHTML: (args:Electron.WebContentsPrintOptions&{html:string}) => ipcRenderer.invoke('printHTML', args),
  exportCSV,
  ...apiExtention,
};
export default api;
