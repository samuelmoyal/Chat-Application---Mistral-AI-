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