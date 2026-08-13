import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { chatAgent } from "@/lib/chat/agent";

// Node runtime (Fluid Compute) — استریمینگ نیاز به edge ندارد.
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  return createAgentUIStreamResponse({
    agent: chatAgent,
    uiMessages: messages,
  });
}
