// /components/ChatInput.tsx
"use client";

import { useState } from "react";

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex mt-2">
      <input
        className="flex-1 p-2 border rounded-l-md"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
      />
      <button
        className="p-2 bg-blue-500 text-white rounded-r-md"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
