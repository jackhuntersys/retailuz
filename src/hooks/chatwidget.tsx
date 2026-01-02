import { useState } from "react";
import type { Message } from "@/types/message";

const API_URL = "https://confocal-cuc-thankfully.ngrok-free.dev/chat";

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();

    setMessages([
      ...newMessages,
      { role: "assistant", content: data.reply },
    ]);

    setLoading(false);
  };

  return (
    <div className="chat-box fixed bottom-[90px] right-[20px] w-[360px] h-[480px] bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.25)]
         flex flex-col">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="msg assistant">Typing…</div>}
      </div>

      <div className="input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask us anything…"
        />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
