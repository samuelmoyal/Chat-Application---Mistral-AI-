export async function sendMessage(message: string) {
    const response = await fetch("/api/relay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  
    if (!response.ok) {
      throw new Error("API request failed");
    }
  
    return response.json();
  }
  