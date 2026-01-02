import { useState } from "react";
import AiChat from "@/hooks/chatwidget";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <AiChat />}
      <button className="chat-launcher fixed bottom-[20px] right-[20px] bg-[#111] text-white px-[18px] py-[14px] rounded-full" 
        onClick={() => setOpen(!open)}>
        Chat with AI
      </button>
    </>
  );
}
