import { ChatMessage, Conversation } from "@/lib/storage";

export async function sendMessage(message: string): Promise<ChatMessage> {
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


  export async function streamMessage(
    message: string,
    onToken: (token: string) => void
  ) {
    const res = await fetch("/api/relay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  
    if (!res.body) throw new Error("No response body");
  
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
  
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        chunk.split("\n").forEach(line => {
          line = line.trim();
          if (!line.startsWith("data: ")) return;
          const payload = line.replace(/^data: /, "").trim();
          if (payload === "[DONE]") return;
  
          try {
            const data = JSON.parse(payload);
            const token = data.choices?.[0]?.delta?.content;
            if (token) {
              onToken(token); 
            }
          } catch {
            
          }
        });
      }
    }
  }

  export async function streamMessageWithHistory(
    conv: Conversation,
    userMessage: string,
    onToken: (token: string) => void
  ) {
    const history: { role: string; content: string }[] = [];
  
    if (conv.summary) {
      history.push({
        role: "system",
        content: `Summary of the conversation:\n${conv.summary}`,
      });
    }
  
    history.push(...conv.messages.map(m => ({ role: m.role, content: m.content })));
    history.push({ role: "user", content: userMessage });
  
    const res = await fetch("/api/relay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "mistral-small",
        messages: history,
        stream: true,
      }),
    });
  
    if (!res.body) throw new Error("No response body");
  
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
  
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        chunk.split("\n").forEach(line => {
          line = line.trim();
          if (!line.startsWith("data: ")) return;
          const payload = line.replace(/^data: /, "").trim();
          if (payload === "[DONE]") return;
  
          try {
            const data = JSON.parse(payload);
            const token = data.choices?.[0]?.delta?.content;
            if (token) {
              onToken(token); 
            }
          } catch {
            
          }
        });
      }
    }
  }
  