import { Outlet } from "react-router";
import { TitleBar } from "../TitleBar";
import { useState } from "react";
import MainNav from "../MainNav";
import { ScrollArea } from "../ui/scroll-area";
export default function RootLayout() {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  return (
    <main className='flex flex-col h-dvh w-screen overflow-hidden'>
      <TitleBar
        title='MCGS Sports'
        toggleNav={() => setCollapsed(!collapsed)}
      />
      <section className='flex flex-1 overflow-hidden h-[calc(100dvh-2rem)]'>
        <MainNav collapsed={collapsed} />
          <div className='p-4 flex-1 flex flex-col h-full relative'>
            <Outlet />
          </div>
      </section>
    </main>
  );
}
