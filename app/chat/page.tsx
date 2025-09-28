// /app/chat/page.tsx
"use client";

import { useState, useEffect } from "react";
import ChatWindow from "@/components/ChatWindow";
import ChatInput from "@/components/ChatInput";
import ConversationMenu from "@/components/ConversationMenu";
import {
  ChatMessage,
  Conversation,
  loadConversations,
  saveConversations,
  createConversation,
} from "@/lib/storage";
import { streamMessage } from "@/lib/api";

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(false);

  // Charger les conversations au montage
  useEffect(() => {
    const convs = loadConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setCurrentConversation(convs[0]);
    }
  }, []);

  // Sélection d’une conversation
  const handleSelectConversation = (conv: Conversation) => {
    setCurrentConversation(conv);
  };

  // Nouvelle conversation
  const handleNewConversation = () => {
    const conv = createConversation("New Conversation");
    const updated = [conv, ...conversations];
    setConversations(updated);
    saveConversations(updated);
    setCurrentConversation(conv);
  };

  // Envoi d’un message
  const handleSend = async (msg: string) => {
    if (!currentConversation) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: Date.now(),
    };

    const assistantMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    // Mettre à jour localement
    const updatedConversations = conversations.map((conv) =>
      conv.id === currentConversation.id
        ? { ...conv, messages: [...conv.messages, userMsg, assistantMsg] }
        : conv
    );

    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    // Avancer le pointeur
    setCurrentConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, userMsg, assistantMsg] } : prev
    );

    setLoading(true);
    try {
      await streamMessage(msg, (chunk) => {
        setConversations((prevConvs) => {
          const updated = prevConvs.map((conv) =>
            conv.id === currentConversation.id
              ? {
                  ...conv,
                  messages: conv.messages.map((m, idx) =>
                    idx === conv.messages.length - 1
                      ? { ...m, content: m.content + chunk }
                      : m
                  ),
                }
              : conv
          );
          saveConversations(updated);
          return updated;
        });

        setCurrentConversation((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.map((m, idx) =>
                  idx === prev.messages.length - 1
                    ? { ...m, content: m.content + chunk }
                    : m
                ),
              }
            : prev
        );
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <ConversationMenu
        conversations={conversations}
        currentId={currentConversation?.id || null}
        onSelect={handleSelectConversation}
        onNew={handleNewConversation}
      />
      <ChatWindow messages={currentConversation?.messages || []} />
      {loading && <div className="text-gray-500 text-sm my-1">Mistral répond...</div>}
      <ChatInput onSend={handleSend} />
    </div>
  );
}
