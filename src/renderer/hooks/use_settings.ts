import {useContext} from "react";
import {SettingsContext} from "~/contexts/settings.context.provider";

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error("useSettings hook must be used within the settings context provider.");
    }
    return context;
}