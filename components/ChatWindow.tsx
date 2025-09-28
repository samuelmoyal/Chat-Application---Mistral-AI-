// /components/ChatWindow.tsx
"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";


export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
};

interface ChatWindowProps {
  messages: Message[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[400px] overflow-y-auto border p-2 bg-gray-100">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg.content} isUser={msg.role === "user"} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
