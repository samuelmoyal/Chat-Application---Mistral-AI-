// /components/ChatInput.tsx
"use client";

import { useState } from "react";
import { Paperclip, Send } from "lucide-react";
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
    <div className="border-t bg-white p-6">
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl resize-none focus:border-orange-400 focus:outline-none transition-colors min-h-[60px] max-h-[120px]"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your message here... (Shift+Enter for new line)"
            rows={2}
          />
          <button
            className="absolute right-3 bottom-3 p-1.5 text-gray-400 hover:text-orange-500 transition-colors"
            onClick={() => {/* Handle file upload */}}
          >
            <Paperclip size={18} />
          </button>
        </div>
        
        <button
          className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
          onClick={handleSend}
          disabled={text.trim() === ""}
        >
          <Send size={20} />
        </button>
      </div>
      
      <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
        <span>Press Enter to send, Shift+Enter for new line</span>
        <span>{text.length}/4000</span>
      </div>
    </div>
  );
}