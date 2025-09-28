
export type ChatMessage = {
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
  }
  
  const STORAGE_KEY = "chat_messages"
  
  export function loadMessages(): ChatMessage[] {
    if (typeof window === "undefined") return [] // côté serveur
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (e) {
      console.error("Error loading messages", e)
      return []
    }
  }
  
  export function saveMessages(messages: ChatMessage[]): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    } catch (e) {
      console.error("Error saving messages", e)
    }
  }
  
  export function addMessage(message: ChatMessage): ChatMessage[] {
    const messages = loadMessages()
    const newMessages = [...messages, message]
    saveMessages(newMessages)
    return newMessages
  }
  
  export function clearMessages(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  }


  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.testStorage = {
      addMessage,
      loadMessages,
      clearMessages,
    };
  }
  
  