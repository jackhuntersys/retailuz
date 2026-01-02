import { useState, useRef, useEffect } from "react";
import AiChat from "@/hooks/chat-ai";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

    /* Close on ESC */
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);


   /* Close on outside click */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!chatRef.current) return;
      if (!chatRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", onClick);
    }

    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);


  return (
     <>
      {/* Launcher */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-[2147483647]
                   bg-black text-white px-4 py-3 rounded-full shadow-lg"
      >
        AI Chat
      </button>

      {/* Chat Panel */}
      {open && (
        <div
          ref={chatRef}
          className="fixed bottom-36 right-4 z-[2147483647]
                     w-[360px] h-[480px]
                     bg-background border rounded-xl shadow-2xl"
        >
          <AiChat onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
