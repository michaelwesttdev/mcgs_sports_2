import {Settings, PSessionSettings,TSessionSettings} from "@/shared/settings"
export class SettingsService{
    async updateSettings(data: Partial<Settings>){
        const res = await window.api.updateSettings({
            type:"main",
            settings:data
        });
        const settings:Settings = res.data;
        return settings;
    }
    async getSettings(){
        const res = await window.api.getSettings({
            type:"main"
        });
        const settings:Settings = res.data;
        return settings;
    }
    async updateSessionSettings<T>({data,sessionId}:{data: Partial<T>,sessionId:string}){
        const res = await window.api.updateSettings({
            type:"session",
            settings:data,
            sessionId
        });
        const settings:T = res.data;
        return settings;
    }
    async getSessionSettings<T>(sessionId:string){
        const res = await window.api.getSettings({
            type:"session",
            sessionId
        });
        const settings:T = res.data;
        return settings;
    }

}