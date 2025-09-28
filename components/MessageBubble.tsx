import { User, Bot, Check, Copy } from "lucide-react";
import { useState } from "react";

// /components/MessageBubble.tsx
interface MessageBubbleProps {
    message: string;
    isUser?: boolean; // optionnel, pour différencier utilisateur vs bot
  }
  
  export default function MessageBubble({ message, isUser }: MessageBubbleProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    return (
      <div className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser 
            ? 'bg-blue-500' 
            : 'bg-gradient-to-br from-orange-400 to-orange-500'
        }`}>
          {isUser ? (
            <User size={20} className="text-white" />
          ) : (
            <Bot size={20} className="text-white" />
          )}
        </div>
  
        {/* Message */}
        <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className="group relative">
            <div className={`p-4 rounded-2xl shadow-sm ${
              isUser 
                ? 'bg-blue-500 text-white rounded-br-md' 
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
            }`}>
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {message}
              </div>
            </div>
            
            {/* Copy button */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all"
              >
                {copied ? (
                  <Check size={14} className="text-green-600" />
                ) : (
                  <Copy size={14} className="text-gray-600" />
                )}
              </button>
            )}
          </div>
          
          <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {isUser ? 'You' : 'Mistral'} • {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  }
  