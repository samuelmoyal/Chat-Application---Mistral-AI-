// /app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindow, { Message } from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import { addMessage, loadMessages } from "@/lib/storage";
import { sendMessage, streamMessage } from "@/lib/api";

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
    const assistantMsg: Message = { id: Date.now().toString(), role: "assistant", content: "", timestamp: Date.now() };
    setLoading(true);
    setMessages(prev => [...prev, assistantMsg]); 


    try {
      await streamMessage(msg, (chunk) => {
        setMessages(prev => {
          const newMessages = [...prev];
          // On met à jour la dernière bulle (assistant)
          const lastIdx = newMessages.length - 1;
          newMessages[lastIdx] = { ...newMessages[lastIdx], content: newMessages[lastIdx].content + chunk };
          return newMessages;
        });
      });
    } catch (err: any) {
      setMessages(prev => {
        const lastIdx = prev.length - 1;
        const newMessages = [...prev];
        newMessages[lastIdx] = { ...newMessages[lastIdx], content:`Erreur : ${err.message || JSON.stringify(err)}` };
        return newMessages;
      });
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


