export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

// Token limits to control costs and response size
const TOKEN_CONFIG = {
  MAX_INPUT_TOKENS: 1000, // Limit input size to prevent abuse
  MAX_OUTPUT_TOKENS: 500, // Limit output to control costs
  MIN_INPUT_LENGTH: 5, // Minimum characters for valid input
  MAX_INPUT_LENGTH: 5000, // Maximum characters to prevent abuse
};

// Optimized system prompt - concise yet effective
const SYSTEM_PROMPT = `You are a professional text editor with expertise in:
- Business communication
- Technical writing
- Academic/professional editing

Guidelines:
1. Preserve the original meaning exactly
2. Improve clarity and conciseness
3. Fix grammar, punctuation, and flow
4. Maintain professional tone
5. Use active voice when appropriate
6. Avoid jargon unless necessary
7. Keep original technical terms`;

// Optimized user prompt template
function createUserPrompt(text: string): string {
  return `Please professionally rewrite this text while preserving all key information:

TEXT TO REWRITE:
${text}

IMPORTANT CONSTRAINTS:
- Keep same factual content
- Do NOT add new information
- Maintain similar length (±20%)
- Return ONLY the rewritten text, no explanations`;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Input validation with character limits
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input: Text is required" },
        { status: 400 },
      );
    }

    const trimmedText = text.trim();

    if (trimmedText.length < TOKEN_CONFIG.MIN_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text must be at least ${TOKEN_CONFIG.MIN_INPUT_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (trimmedText.length > TOKEN_CONFIG.MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text exceeds maximum length of ${TOKEN_CONFIG.MAX_INPUT_LENGTH} characters`,
          suggestion: "Please break your text into smaller chunks",
        },
        { status: 400 },
      );
    }

    // Estimate tokens (rough approximation: 1 token ≈ 4 characters)
    const estimatedTokens = Math.ceil(trimmedText.length / 4);
    if (estimatedTokens > TOKEN_CONFIG.MAX_INPUT_TOKENS) {
      return NextResponse.json(
        {
          error: "Text too long for processing",
          maxTokens: TOKEN_CONFIG.MAX_INPUT_TOKENS,
          estimatedTokens,
        },
        { status: 400 },
      );
    }

    const startTime = Date.now();
    let responseTime = 0;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3, // Low temperature for consistent, professional output
      max_tokens: TOKEN_CONFIG.MAX_OUTPUT_TOKENS, // Limit output tokens
      top_p: 0.95, // Better than temperature alone for professional writing
      frequency_penalty: 0.2, // Slight penalty to reduce repetition
      presence_penalty: 0.1, // Encourages some lexical diversity
      stream: false, // Keep false for API consistency
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createUserPrompt(trimmedText),
        },
      ],
    });

    responseTime = Date.now() - startTime;

    const result = completion.choices[0]?.message?.content?.trim() || "";

    // Validate response
    if (!result) {
      throw new Error("Empty response from AI service");
    }

    // Log performance metrics (for monitoring)
    console.log({
      event: "rewrite_success",
      inputLength: trimmedText.length,
      outputLength: result.length,
      estimatedInputTokens: estimatedTokens,
      actualOutputTokens: completion.usage?.completion_tokens || 0,
      totalTokens: completion.usage?.total_tokens || 0,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      result,
      metadata: {
        inputLength: trimmedText.length,
        outputLength: result.length,
        processingTime: responseTime,
        model: "llama-3.3-70b-versatile",
      },
    });
  } catch (error: any) {
    console.error("Groq API error:", {
      error: error?.message,
      status: error?.status,
      code: error?.code,
      timestamp: new Date().toISOString(),
    });

    // Handle specific error types
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          suggestion: "Please wait a moment and try again",
        },
        { status: 429 },
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: "Authentication failed",
          suggestion: "Check your API key configuration",
        },
        { status: 401 },
      );
    }

    if (error?.status === 400 && error?.message?.includes("model")) {
      return NextResponse.json(
        {
          error: "Model configuration error",
          suggestion: "Contact support - model may need updating",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Text rewriting service unavailable",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
        suggestion: "Please try again in a few moments",
      },
      { status: 500 },
    );
  }
}
