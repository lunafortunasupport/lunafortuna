import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { chatAgent } from "@/lib/chat/agent";

// Node runtime (Fluid Compute) — استریمینگ نیاز به edge ندارد.
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  return createAgentUIStreamResponse({
    agent: chatAgent,
    uiMessages: messages,
    onError: (error) => {
      // پیشِ‌فرضِ AI SDK پیامِ خطا را مخفی می‌کند («An error occurred.»)؛
      // اینجا لاگ می‌کنیم و یک پیامِ قابل‌فهم برمی‌گردانیم تا عیب‌یابی ممکن باشد.
      console.error("[chat] agent error:", error);
      if (error instanceof Error) return error.message;
      return typeof error === "string" ? error : "خطای نامشخص در پردازشِ پیام.";
    },
  });
}
