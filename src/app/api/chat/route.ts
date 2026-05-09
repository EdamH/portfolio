import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat-prompt";

/* ═══ Model fallback chain ═══
 * Priority: best quality first, massive-quota fallback last.
 * For each model, we try ALL keys before moving to the next model.
 */

const MODEL_CHAIN = [
  "gemini-2.5-flash",      // Best quality, 20 RPD per key
  "gemini-2.5-flash-lite", // Good quality, 20 RPD per key
  "gemma-3-27b-it",        // Decent quality, 14,400 RPD — the safety net
];

/* ═══ Token cycling ═══ */

function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const key = process.env[`GEMINI_KEY_${i}`];
    if (key) keys.push(key);
  }
  if (keys.length === 0 && process.env.GEMINI_API_KEY) {
    keys.push(process.env.GEMINI_API_KEY);
  }
  return keys;
}

let keyIndex = 0;

function getNextKeyIndex(): number {
  const keys = getApiKeys();
  if (keys.length === 0) return -1;
  const idx = keyIndex % keys.length;
  keyIndex++;
  return idx;
}

/* ═══ Rate limiting ═══ */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;
  entry.count++;
  return false;
}

/* ═══ Types ═══ */

interface ChatMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

/* ═══ Helpers ═══ */

function buildStreamUrl(model: string, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
}

function buildUrl(model: string, apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
}

/**
 * Try to get a working stream response by cycling keys then falling back models.
 * Returns { response, model } on success, or null if everything is exhausted.
 */
async function getStreamResponse(
  body: Record<string, unknown>
): Promise<{ response: Response; model: string } | null> {
  const keys = getApiKeys();
  if (keys.length === 0) return null;

  for (const model of MODEL_CHAIN) {
    const startIdx = getNextKeyIndex();
    if (startIdx === -1) return null;

    for (let i = 0; i < keys.length; i++) {
      const idx = (startIdx + i) % keys.length;
      const key = keys[idx];
      if (i > 0) keyIndex++;

      // Try streaming first
      const res = await fetch(buildStreamUrl(model, key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) return { response: res, model };

      if (res.status !== 429) {
        console.error(`[chat] ${model} key#${idx} error:`, res.status);
        break; // non-rate-limit error, skip to next model
      }

      console.warn(`[chat] ${model} key#${idx} rate-limited, trying next key...`);
    }

    console.warn(`[chat] Falling back from ${model}...`);
  }

  return null;
}

/**
 * Non-streaming fallback — used if stream parsing fails.
 */
async function getNonStreamResponse(
  body: Record<string, unknown>
): Promise<string | null> {
  const keys = getApiKeys();
  if (keys.length === 0) return null;

  // Just try gemma (the safety net) with the next key
  const idx = getNextKeyIndex();
  if (idx === -1) return null;
  const key = keys[idx];

  const res = await fetch(buildUrl("gemma-3-27b-it", key), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const candidates = data?.candidates as Array<{
    content?: { parts?: Array<{ text?: string }> };
  }> | undefined;
  return candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/* ═══ POST handler ═══ */

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please try again later." },
        { status: 429 }
      );
    }

    const { message, history } = (await request.json()) as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    if (message.trim().length > 500) {
      return NextResponse.json(
        { error: "Message too long (max 500 characters)." },
        { status: 400 }
      );
    }

    if (getApiKeys().length === 0) {
      return NextResponse.json(
        { error: "Chat is currently unavailable." },
        { status: 503 }
      );
    }

    const contents: ChatMessage[] = [
      ...(history || []).slice(-10),
      { role: "user", parts: [{ text: message.trim() }] },
    ];

    const body = {
      system_instruction: {
        parts: [{ text: buildSystemPrompt() }],
      },
      contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.9,
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    // Try to get a streaming response
    const result = await getStreamResponse(body);

    if (!result) {
      // Last resort: non-streaming fallback
      const text = await getNonStreamResponse(body);
      if (text) {
        return NextResponse.json({ text, model: "gemma-3-27b-it" });
      }
      return NextResponse.json(
        { error: "I'm a bit busy right now. Try again in a moment!" },
        { status: 429 }
      );
    }

    const { response: geminiRes, model } = result;

    // Pipe Gemini's SSE stream through to the client, extracting text chunks
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send model name as first event
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ model })}\n\n`)
          );

          const reader = geminiRes.body?.getReader();
          if (!reader) {
            controller.close();
            return;
          }

          const decoder = new TextDecoder();
          let buffer = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6).trim();
              if (!jsonStr) continue;

              try {
                const chunk = JSON.parse(jsonStr);
                const text =
                  chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }

          // Process remaining buffer
          if (buffer.startsWith("data: ")) {
            const jsonStr = buffer.slice(6).trim();
            if (jsonStr) {
              try {
                const chunk = JSON.parse(jsonStr);
                const text =
                  chunk?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
                  );
                }
              } catch {
                // Skip
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
