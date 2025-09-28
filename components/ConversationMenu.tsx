// /components/ConversationMenu.tsx
"use client";

import { Conversation } from "@/lib/storage";

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
    <div className="mb-2 flex items-center gap-2">
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={onNew}
      >
        New Conversation
      </button>

      <select
        value={currentId || ""}
        onChange={(e) => handleSelect(e.target.value)}
        className="border rounded px-2 py-1 flex-1"
      >
        {conversations.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>
    </div>
  );
}
