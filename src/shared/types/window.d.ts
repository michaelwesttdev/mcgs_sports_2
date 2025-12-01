import { IAppApi } from "@/main/preload";

declare global {
  interface Window {
    api: IAppApi;
  }
}
