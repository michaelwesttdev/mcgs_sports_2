import {createContext, useEffect, useState} from "react";
import {SettingsService} from "@/services/settings.service";
import {Settings,defaultSettings} from "@/shared/settings";

interface SettingsContextType{
    settings:Settings,
    fetchSettings:() => Promise<any>
    updateSettings:(data:Partial<Settings>) => Promise<any> 
}
export const SettingsContext = createContext<SettingsContextType>({
    settings:{...defaultSettings},
    fetchSettings:()=>Promise.resolve({}),
    updateSettings:()=>Promise.resolve({}),
});

export default function SettingsContextProvider({children}:{children:React.ReactNode}){
    const [settings, setSettings] = useState<Settings>(defaultSettings);
    const settingsService = new SettingsService()
    async function fetchSettings(){
        const res = await settingsService.getSettings();
        setSettings(res);
    }
    async function updateSettings(data:Partial<Settings>){
        const res = await settingsService.updateSettings(data);
        setSettings(res);
    }
    useEffect(()=>{
        (async()=>{
            await fetchSettings();
        })()
    },[])
    return(
        <SettingsContext.Provider value={{
            settings,
            fetchSettings,
            updateSettings
        }}>
            {children}
            </SettingsContext.Provider>
    )
}