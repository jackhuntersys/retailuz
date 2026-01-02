import { useState } from "react";
import type { Message } from "@/types/message";

const API_URL = "https://confocal-cuc-thankfully.ngrok-free.dev/chat";

type Props = {
  onClose: () => void;
};

// export default function AiChat({ onClose }: Props) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const send = async () => {
//     if (!input.trim()) return;

//     const newMessages: Message[] = [
//       ...messages,
//       { role: "user", content: input },
//     ];

//     setMessages(newMessages);
//     setInput("");
//     setLoading(true);

//     try {
//       const res = await fetch(API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ messages: newMessages }),
//       });

//       const data = await res.json();

//       setMessages([
//         ...newMessages,
//         { role: "assistant", content: data.reply },
//       ]);
//     } catch (err) {
//       setMessages([
//         ...newMessages,
//         {
//           role: "assistant",
//           content: "Sorry, something went wrong.",
//         },
//       ]);
//     } finally {

//       setLoading(false);
//     };

  
//    return (
//     <div className="flex flex-col h-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-4 py-3 border-b">
//         <span className="font-semibold"> RetailUz  AI</span>
//         <button onClick={onClose} className="text-sm opacity-60">
//           ✕
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4" >
//         {/* messages go here */}
//       </div>

//       {/* Input */}
//       <div className="p-3 border-t">
//         <input
//           placeholder="Ask anything..."
//           className="w-full border rounded-lg px-3 py-2 text-red-900"
//         />
//       </div>
//     </div>
//   );

// }


export default function AiChat({ onClose }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setMessages([
        ...updatedMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <span className="font-semibold">AI Assistant</span>
        <button onClick={onClose}>✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
              m.role === "user"
                ? "ml-auto bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="bg-muted px-3 py-2 rounded-lg text-sm w-fit">
            Typing…
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask anything..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm text-red-900"
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
