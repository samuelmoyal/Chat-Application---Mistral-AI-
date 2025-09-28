import { sendMessage } from "./api";
import { Conversation } from "./storage";

export async function summarizeConversation(conv: Conversation): Promise<string> {
  const text = conv.messages
    .slice(0, 15)
    .map(m => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `Résumé de cette conversation (concis, mais garde les infos clés):\n${text}`;

  const summary = await sendMessage(prompt); 
  return summary.content;
}
