import { Message } from "@/components/ChatWindow";

export async function sendMessage(message: string): Promise<Message> {
    const response = await fetch("/api/relay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok) {
      throw new Error("API request failed");
    }
  
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No answer from the AI";
    return {
      id: Date.now().toString(),
      role: "assistant",
      content,
      timestamp: Date.now(),
    };
  }
  