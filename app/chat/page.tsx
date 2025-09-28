// /app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { addMessage, loadMessages } from "@/lib/storage";

export default function ChatPage() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    setMessages(loadMessages().map(msg => msg.content));
  }, []);

  const handleSend = (msg: string) => {
    addMessage({ id: Date.now().toString(), role: "user", content: msg, timestamp: Date.now() }); 
    setMessages([...messages, msg]); // update UI instant
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}
