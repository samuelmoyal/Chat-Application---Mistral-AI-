// /components/ChatWindow.tsx
"use client";

import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
  messages: string[];
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll quand de nouveaux messages arrivent
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[400px] overflow-y-auto border p-2 bg-gray-100">
      {messages.map((msg, idx) => (
        <MessageBubble key={idx} message={msg} isUser={idx % 2 === 0} />
      ))}
      <div ref={endRef} />
    </div>
  );
}
