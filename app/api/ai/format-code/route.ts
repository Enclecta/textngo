import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

type RouteError = {
  message?: string;
  status?: number;
  code?: string;
};

const CODE_FORMAT_CONFIG = {
  MIN_INPUT_LENGTH: 2,
  MAX_INPUT_LENGTH: 8000,
  MAX_OUTPUT_TOKENS: 1800,
};

const CODE_FORMAT_SYSTEM_PROMPT = `You are an expert code formatter.

CRITICAL RULES:
1. Return ONLY the formatted code
2. Do NOT explain anything
3. Preserve the exact logic and behavior
4. Fix indentation, spacing, line breaks, and brace placement
5. Infer the programming language from the input
6. Preserve comments and strings exactly unless whitespace formatting requires alignment
7. If the input is partial code, format it without adding wrappers or missing code
8. Never surround the output with markdown fences`;

function createCodeFormatPrompt(text: string): string {
  return `Format this code so it is clean, readable, and properly indented.
Do not change its behavior.

CODE:
${text}

FORMATTED CODE:`;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Code input is required and must be a string" },
        { status: 400 },
      );
    }

    const normalizedText = text.replace(/\r\n/g, "\n").trim();

    if (normalizedText.length < CODE_FORMAT_CONFIG.MIN_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Code must be at least ${CODE_FORMAT_CONFIG.MIN_INPUT_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (normalizedText.length > CODE_FORMAT_CONFIG.MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Code exceeds maximum length of ${CODE_FORMAT_CONFIG.MAX_INPUT_LENGTH} characters`,
          suggestion: "Please format a smaller code block at a time",
        },
        { status: 400 },
      );
    }

    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.05,
      max_tokens: CODE_FORMAT_CONFIG.MAX_OUTPUT_TOKENS,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0,
      messages: [
        {
          role: "system",
          content: CODE_FORMAT_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createCodeFormatPrompt(normalizedText),
        },
      ],
    });

    const result = completion.choices[0]?.message?.content?.trim() || "";

    if (!result) {
      throw new Error("Empty response from code formatting service");
    }

    return NextResponse.json({
      result,
      metadata: {
        inputLength: normalizedText.length,
        outputLength: result.length,
        processingTime: Date.now() - startTime,
        tokensUsed: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error: unknown) {
    const routeError = error as RouteError;

    console.error("Code format API error:", {
      error: routeError?.message,
      status: routeError?.status,
      code: routeError?.code,
      timestamp: new Date().toISOString(),
    });

    if (routeError?.status === 429) {
      return NextResponse.json(
        {
          error: "Too many formatting requests",
          suggestion: "Please wait a moment and try again",
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        error: "Code formatting service unavailable",
        details:
          process.env.NODE_ENV === "development"
            ? routeError?.message
            : undefined,
        suggestion: "Please try again shortly",
      },
      { status: 500 },
    );
  }
}
