import { createContext, useContext, useEffect, useState } from "react";
import { SettingsService } from "@/services/settings.service";
import { PSessionSettings, defaultPSessionSettings as defaultSettings } from "@/shared/settings";
import { FetchSessionSettingsArgs, UpdateSessionSettingsArgs } from "@/shared/types/api";
import { Toast } from "@/renderer/components/Toast";

interface SessionSettingsContextType {
    settings: PSessionSettings,
    fetchSettings: (args: FetchSessionSettingsArgs) => Promise<any>
    updateSettings: (args: Omit<UpdateSessionSettingsArgs, "sessionId" | "type">) => Promise<boolean>
    setSessionId: (id: string | null) => void,
    fetchAndUpdateSettingsFromAnotherSession(id: string): Promise<void>
}
export const SessionSettingsContext = createContext<SessionSettingsContextType>({
    settings: { ...defaultSettings },
    fetchSettings: () => Promise.resolve({}),
    updateSettings: () => Promise.resolve(false),
    fetchAndUpdateSettingsFromAnotherSession: () => Promise.resolve(),
    setSessionId: () => Promise.resolve(),
});

export default function SessionSettingsContextProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<PSessionSettings>(defaultSettings);
    const [sessionId, setSessionId] = useState<string>(null)
    const settingsService = new SettingsService()
    async function fetchSettings() {
        console.log("calling settings api")

        const res = await settingsService.getSessionSettings<PSessionSettings>(sessionId);
        setSettings(res);
    }
    async function fetchAndUpdateSettingsFromAnotherSession(id: string) {
        try {
            //connect session json file
            await window.api.handleSessionSettingsContextCreate(settings,id);
            //fetch settings
            const otherSettings = await settingsService.getSessionSettings(id);
            //update self
            await updateSettings({settings:otherSettings});
            //close session json file
            await window.api.handleSessionSettingsContextClose(id);
            Toast({message:"Settings Shared Successfully",variation:"success"});
        } catch (e) {
            console.log(e);
            Toast({message:"An Error Occured Whilst Sharing Settings",variation:"error"})
         }
    }
    async function updateSettings(args: Omit<UpdateSessionSettingsArgs, "sessionId" | "type">) {
        if (!sessionId) return false;
        const res = await settingsService.updateSessionSettings<PSessionSettings>({ data: args.settings as PSessionSettings, sessionId });
        setSettings(res);
        return true;
    }
    function changeSessionId(id: string | null) {
        setSessionId(id)
    }
    useEffect(() => {
        (async () => {
            if (sessionId) {
                await fetchSettings();
            }
        })()
    }, [sessionId])
    return (
        <SessionSettingsContext.Provider value={{
            settings,
            fetchSettings,
            updateSettings,
            setSessionId: changeSessionId,
            fetchAndUpdateSettingsFromAnotherSession
        }}>
            {children}
        </SessionSettingsContext.Provider>
    )
}
export function useSessionSettings() {
    const context = useContext(SessionSettingsContext);
    if (!context) {
        throw new Error("useSessionSettings hook must be used within the session settings context provider.");
    }
    return context;
}