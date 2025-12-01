import React from "react";
import EventContextProvider from "./event.context.provider";
import SessionContextProvider from "./session.context.provider";
import SettingsContextProvider from "~/contexts/settings.context.provider";
import PrintersContextProvider from "./printer.context.provider";
import PrinterSelectionProvider from "../providers/PrinterSelectionProvider";
import StudentContextProvider from "./student.context.provider";
import MainHousesContextProvider from "./main.house.context.provider";

type Props = {
  children: React.ReactNode;
};

export default function GlobalContextProvider({ children }: Props) {
  return (
    <PrintersContextProvider>
      <SettingsContextProvider>
            <EventContextProvider>
                <SessionContextProvider>
                    <PrinterSelectionProvider>
                      <StudentContextProvider>
                        <MainHousesContextProvider>
                          {children}
                        </MainHousesContextProvider>
                      </StudentContextProvider>
                    </PrinterSelectionProvider>
                </SessionContextProvider>
            </EventContextProvider>
    </SettingsContextProvider>
    </PrintersContextProvider>
  );
}
