import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

// Configuration
const GRAMMAR_CONFIG = {
  MIN_INPUT_LENGTH: 5,
  MAX_INPUT_LENGTH: 3000, // Reduced for grammar checking
  MAX_OUTPUT_TOKENS: 300, // Grammar fixes usually don't add much length
};

// System prompt optimized for grammar checking
const GRAMMAR_SYSTEM_PROMPT = `You are a professional grammar, punctuation, and clarity expert.

CRITICAL RULES:
1. ONLY fix grammar, punctuation, spelling, and sentence flow errors
2. DO NOT change the tone, style, or meaning
3. DO NOT add or remove content
4. DO NOT change vocabulary unless it's grammatically incorrect
5. Preserve all technical terms, names, numbers, and formatting

WHAT TO FIX:
- Subject-verb agreement
- Verb tense consistency
- Punctuation (commas, periods, apostrophes)
- Spelling errors
- Sentence fragments or run-ons
- Awkward phrasing
- Pronoun reference issues
- Capitalization rules
- Parallel structure

RETURN ONLY the corrected text with no explanations.`;

// User prompt template
function createGrammarPrompt(text: string): string {
  return `Please fix ONLY grammar, punctuation, and sentence flow errors in this text.
Preserve everything else exactly as written.

TEXT:
${text}

CORRECTED TEXT:`;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Input validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text input is required and must be a string" },
        { status: 400 },
      );
    }

    const trimmedText = text.trim();

    if (trimmedText.length < GRAMMAR_CONFIG.MIN_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text must be at least ${GRAMMAR_CONFIG.MIN_INPUT_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (trimmedText.length > GRAMMAR_CONFIG.MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Text exceeds maximum length of ${GRAMMAR_CONFIG.MAX_INPUT_LENGTH} characters`,
          suggestion: "Please process smaller sections at a time",
        },
        { status: 400 },
      );
    }

    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.1, // Very low temperature for minimal changes
      max_tokens: GRAMMAR_CONFIG.MAX_OUTPUT_TOKENS,
      top_p: 0.95,
      frequency_penalty: 0.1, // Minimal penalty to preserve original wording
      presence_penalty: 0.1,
      messages: [
        {
          role: "system",
          content: GRAMMAR_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createGrammarPrompt(trimmedText),
        },
      ],
    });

    const responseTime = Date.now() - startTime;
    const result = completion.choices[0]?.message?.content?.trim() || "";

    // Validate response
    if (!result) {
      throw new Error("Empty response from grammar service");
    }

    // Log success metrics
    console.log({
      event: "grammar_fix_success",
      inputLength: trimmedText.length,
      outputLength: result.length,
      responseTime: `${responseTime}ms`,
      tokensUsed: completion.usage?.total_tokens || 0,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      result,
      metadata: {
        inputLength: trimmedText.length,
        outputLength: result.length,
        processingTime: responseTime,
        tokensUsed: completion.usage?.total_tokens || 0,
      },
    });
  } catch (error: any) {
    console.error("Grammar API error:", {
      error: error?.message,
      status: error?.status,
      code: error?.code,
      timestamp: new Date().toISOString(),
    });

    // Handle specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: "Too many requests",
          suggestion: "Please wait a moment before trying again",
        },
        { status: 429 },
      );
    }

    if (error?.status === 400 && error?.code === "model_decommissioned") {
      return NextResponse.json(
        {
          error: "Service update required",
          suggestion: "Contact support for assistance",
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Grammar checking service unavailable",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
        suggestion: "Please try again shortly",
      },
      { status: 500 },
    );
  }
}
