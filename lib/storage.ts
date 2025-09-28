
export type ChatMessage = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
  }


  export interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
  }
  
  const STORAGE_KEY = "chat_messages"

  export function loadConversations(): Conversation[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }




  export function saveConversations(conversations: Conversation[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }


  export function createConversation(title = "New Conversation"): Conversation {
    const conv: Conversation = {
      id: crypto.randomUUID(),
      title,
      messages: [],
    };
    const all = loadConversations();
    saveConversations([conv, ...all]);
    return conv;
  }


  export function getConversation(id: string): Conversation | undefined {
    return loadConversations().find(c => c.id === id);
  }
  

  



export function addMessageToConversation(conversationId: string, message: ChatMessage): Conversation[] {
  const allConvs = loadConversations();
  const updatedConvs = allConvs.map(conv => {
    if (conv.id === conversationId) {
      // Retourne une nouvelle version de la conversation avec le message ajouté
      return {
        ...conv,
        messages: [...conv.messages, message],
      };
    }
    return conv;
  });
  saveConversations(updatedConvs);
  return updatedConvs;
}

export function updateLastMessage(conversationId: string, updatedMessage: ChatMessage): Conversation[] {
  const allConvs = loadConversations();
  const updatedConvs = allConvs.map(conv => {
      if (conv.id === conversationId) {
          const newMessages = [...conv.messages];
          // Remplace le dernier message
          newMessages[newMessages.length - 1] = updatedMessage;
          return {
              ...conv,
              messages: newMessages,
          };
      }
      return conv;
  });

  saveConversations(updatedConvs);
  return updatedConvs;
}




export function deleteConversation(id: string): Conversation[] {
  const allConvs = loadConversations();
  const updatedConvs = allConvs.filter(conv => conv.id !== id);
  saveConversations(updatedConvs);
  return updatedConvs;
}