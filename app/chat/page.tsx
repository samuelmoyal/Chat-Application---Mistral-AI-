// /app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindow, { Message } from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { addMessage, loadMessages } from "@/lib/storage";
import { sendMessage } from "@/lib/api";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMessages(loadMessages());
  }, []);

  const handleSend = async (msg: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: Date.now(),
    };
    addMessage(userMsg); 
    setMessages([...messages, userMsg]); 
    setLoading(true);
    try {
      const botMsg = await sendMessage(msg);
      addMessage(botMsg);
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Erreur lors de l'envoi au serveur.",
        timestamp: Date.now(),
      };
      addMessage(errorMsg);
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-md mx-auto mt-10">
      <ChatWindow messages={messages} />
      {loading && <div className="text-gray-500 text-sm my-1">Mistral répond...</div>}
      <ChatInput onSend={handleSend} />
    </div>
  )

}


