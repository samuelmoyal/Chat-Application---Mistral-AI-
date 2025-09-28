// /components/ConversationMenu.tsx
"use client";


import { Conversation } from "@/lib/storage";
import { Plus, MessageCircle, ChevronDown } from "lucide-react";
interface ConversationMenuProps {
  conversations: Conversation[];
  currentId: string | null;
  onSelect: (conv: Conversation) => void;
  onNew: () => void;
}

export default function ConversationMenu({
  conversations,
  currentId,
  onSelect,
  onNew,
}: ConversationMenuProps) {
  const handleSelect = (id: string) => {
    const conv = conversations.find((c) => c.id === id);
    if (conv) onSelect(conv);
  };

  return (
    <div className="border-b bg-gray-50 p-4">
      <div className="flex items-center gap-3">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 font-medium shadow-lg"
          onClick={onNew}
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="flex-1 relative">
          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle size={18} />
            <select
              value={currentId || ""}
              onChange={(e) => handleSelect(e.target.value)}
              className="appearance-none bg-white border-2 border-gray-200 rounded-lg px-4 py-2 pr-10 flex-1 focus:border-orange-400 focus:outline-none transition-colors cursor-pointer hover:border-gray-300"
            >
              {conversations.length === 0 ? (
                <option value="">No conversations yet</option>
              ) : (
                conversations.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))
              )}
            </select>
            <ChevronDown 
              size={18} 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400"
            />
          </div>
        </div>
        
        {conversations.length > 0 && (
          <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full border">
            {conversations.length} conversation{conversations.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
      

    </div>
  );
}
