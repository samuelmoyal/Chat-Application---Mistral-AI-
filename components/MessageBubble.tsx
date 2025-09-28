

// /components/MessageBubble.tsx
interface MessageBubbleProps {
    message: string;
    isUser?: boolean; // optionnel, pour différencier utilisateur vs bot
  }
  
  export default function MessageBubble({ message, isUser }: MessageBubbleProps) {
    return (
      <div
        className={`p-2 m-1 rounded-md max-w-xs ${
          isUser ? "bg-blue-500 text-white self-end" : "bg-gray-300 text-black self-start"
        }`}
      >
        {message}
      </div>
    );
  }
  