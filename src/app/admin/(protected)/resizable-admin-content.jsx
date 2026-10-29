"use client";

import { useRef, useState } from "react";
import { MoreVertical } from "lucide-react";
import AdminSidebar from "./sidebar";

const MIN_SIDEBAR_WIDTH = 72;
const MAX_SIDEBAR_WIDTH = 240;

export default function ResizableAdminContent({ children }) {
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const dragStart = useRef(null);

  function handlePointerDown(event) {
    event.preventDefault();
    dragStart.current = { x: event.clientX, width: sidebarWidth };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragStart.current) {
      return;
    }

    const nextWidth =
      dragStart.current.width + event.clientX - dragStart.current.x;
    setSidebarWidth(
      Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, nextWidth)),
    );
  }

  function handlePointerUp() {
    dragStart.current = null;
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const adjustment = event.key === "ArrowLeft" ? -16 : 16;
      setSidebarWidth((width) =>
        Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, width + adjustment)),
      );
    } else if (event.key === "Home") {
      event.preventDefault();
      setSidebarWidth(MIN_SIDEBAR_WIDTH);
    } else if (event.key === "End") {
      event.preventDefault();
      setSidebarWidth(MAX_SIDEBAR_WIDTH);
    }
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <AdminSidebar width={sidebarWidth} />
      <button
        type="button"
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemin={MIN_SIDEBAR_WIDTH}
        aria-valuemax={MAX_SIDEBAR_WIDTH}
        aria-valuenow={sidebarWidth}
        title="Drag to resize sidebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        className="hidden -ml-2 w-2 shrink-0 cursor-col-resize touch-none items-center justify-center text-[#a29b90] hover:text-[#c2410c] focus-visible:outline-2 focus-visible:outline-[#c2410c] md:flex"
      >
        <MoreVertical size={24} aria-hidden="true" />
      </button>
      <main className="my-2 mr-2 min-w-0 flex-1 overflow-y-auto overscroll-y-contain rounded-md border border-[#e9e3d9] bg-white p-5">
        {children}
      </main>
    </div>
  );
}
