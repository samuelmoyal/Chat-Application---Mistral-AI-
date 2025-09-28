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
import { streamMessage, streamMessageWithHistory } from "@/lib/api";
import { summarizeConversation } from "@/lib/summarizer";

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

  const handleSend = async (msg: string) => {
    if (!currentConversation) return;
  
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: msg,
      timestamp: Date.now(),
    };
  
    // D'abord, juste ajouter le message user (comme dans votre ancien code)
    let updatedConv: Conversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMsg],
    };
  
    if (updatedConv.messages.length > 20) {
      const summary = await summarizeConversation(updatedConv);
      updatedConv.summary = (updatedConv.summary || "") + "\n" + summary;
      updatedConv.messages = updatedConv.messages.slice(-5);
    }
  
    // Sauvegarder avec juste le message user
    let newConvs = conversations.map(c =>
      c.id === updatedConv.id ? updatedConv : c
    );
    setConversations(newConvs);
    setCurrentConversation(updatedConv);
    saveConversations(newConvs);
  
    // Maintenant on envoie à l'API (sans le message assistant vide)
    try {
      await streamMessageWithHistory(updatedConv, msg, (chunk: string) => {
        setConversations(prev => {
          const convs = [...prev];
          const idx = convs.findIndex(c => c.id === updatedConv.id);
          if (idx !== -1) {
            const conv = convs[idx];
            const lastIdx = conv.messages.length - 1;
            
            // Si c'est le premier chunk, ajouter le message assistant
            if (conv.messages[lastIdx].role !== "assistant") {
              conv.messages.push({
                id: Date.now().toString() + "-a",
                role: "assistant",
                content: chunk,
                timestamp: Date.now(),
              });
            } else {
              // Sinon, ajouter au message assistant existant
              conv.messages[lastIdx].content += chunk;
            }
            convs[idx] = conv;
          }
          return convs;
        });
  
        // Aussi mettre à jour currentConversation
        setCurrentConversation(prev => {
          if (!prev || prev.id !== updatedConv.id) return prev;
          
          const newMessages = [...prev.messages];
          const lastIdx = newMessages.length - 1;
          
          // Si c'est le premier chunk, ajouter le message assistant
          if (newMessages[lastIdx].role !== "assistant") {
            newMessages.push({
              id: Date.now().toString() + "-a",
              role: "assistant",
              content: chunk,
              timestamp: Date.now(),
            });
          } else {
            // Sinon, ajouter au message assistant existant
            newMessages[lastIdx] = {
              ...newMessages[lastIdx],
              content: newMessages[lastIdx].content + chunk
            };
          }
          
          return {
            ...prev,
            messages: newMessages
          };
        });
      });
    } catch (err) {
      console.error(err);
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
