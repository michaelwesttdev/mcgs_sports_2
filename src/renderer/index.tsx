import '@ant-design/v5-patch-for-react-19';
import "~/styles/globals.css"
import { createRoot } from "react-dom/client";
import React from "react";
import { HashRouter } from "react-router";
import App from "./App";
import { Toaster } from "sonner";
import GlobalContextProvider from "./contexts";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter>
      <GlobalContextProvider>
        <App />
        <Toaster />
      </GlobalContextProvider>
    </HashRouter>
  </React.StrictMode>
);
