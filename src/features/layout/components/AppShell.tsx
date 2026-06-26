"use client";

import { useState } from "react";
import { Header } from "./Header";
import { MobileSideBar } from "./MobileSideBar";
import { Overlay } from "./Overlay";

export function AppShell() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative z-20">
      <MobileSideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Overlay isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header onMenuClick={() => setIsSidebarOpen(true)} />
    </div>
  );
}
