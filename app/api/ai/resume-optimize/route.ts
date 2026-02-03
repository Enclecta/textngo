import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";

// Configuration for resume optimization
const RESUME_CONFIG = {
  MIN_INPUT_LENGTH: 5,
  MAX_INPUT_LENGTH: 1000, // Resume bullets are typically short
  MAX_OUTPUT_TOKENS: 200, // Concise outputs for resumes
};

// Common ATS-friendly action verbs (for reference)
const ACTION_VERBS = [
  "achieved",
  "managed",
  "developed",
  "implemented",
  "led",
  "improved",
  "increased",
  "reduced",
  "created",
  "designed",
  "established",
  "optimized",
  "streamlined",
  "coordinated",
  "facilitated",
  "analyzed",
  "resolved",
  "trained",
  "mentored",
  "negotiated",
  "presented",
  "published",
  "researched",
  "saved",
];

// System prompt optimized for resume writing
const RESUME_SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) resume writer and career coach.

CRITICAL ATS RULES:
1. Start every bullet point with a strong action verb (past tense for past roles)
2. Include quantifiable metrics whenever possible (numbers, percentages, $ amounts)
3. Use industry-standard keywords from the job description
4. Avoid pronouns (I, me, my) - they're implied
5. Be concise and results-oriented
6. Focus on achievements, not just responsibilities

CONTENT GUIDELINES:
- Use PAR (Problem-Action-Result) or STAR (Situation-Task-Action-Result) method
- Highlight transferable skills
- Show impact and value added
- Use industry-appropriate terminology
- Keep language professional but not overly complex
- Optimize for both human readers and ATS scanners

FORMAT RULES:
- Return ONLY the rewritten resume text
- No explanations, notes, or commentary
- Keep similar length (be concise)
- Use bullet points if appropriate
- Maintain chronological consistency`;

// User prompt template for resume optimization
function createResumePrompt(text: string): string {
  return `Optimize this resume text for ATS scanning and professional impact.
Focus on achievements, metrics, and action verbs.

RESUME TEXT TO OPTIMIZE:
${text}

OPTIMIZED ATS-FRIENDLY VERSION:`;
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    // Input validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Resume text input is required" },
        { status: 400 },
      );
    }

    const trimmedText = text.trim();

    if (trimmedText.length < RESUME_CONFIG.MIN_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Resume text must be at least ${RESUME_CONFIG.MIN_INPUT_LENGTH} characters`,
        },
        { status: 400 },
      );
    }

    if (trimmedText.length > RESUME_CONFIG.MAX_INPUT_LENGTH) {
      return NextResponse.json(
        {
          error: `Resume text exceeds maximum length of ${RESUME_CONFIG.MAX_INPUT_LENGTH} characters`,
          suggestion: "Please optimize one bullet point or section at a time",
        },
        { status: 400 },
      );
    }

    const startTime = Date.now();

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.25,
      max_tokens: RESUME_CONFIG.MAX_OUTPUT_TOKENS,
      top_p: 0.9, // Slightly lower for more focused results
      frequency_penalty: 0.15,
      presence_penalty: 0.1,
      messages: [
        {
          role: "system",
          content: RESUME_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: createResumePrompt(trimmedText),
        },
      ],
    });

    const responseTime = Date.now() - startTime;
    const result = completion.choices[0]?.message?.content?.trim() || "";

    // Validate response
    if (!result) {
      throw new Error("Empty response from resume optimization service");
    }

    // Log success metrics
    console.log({
      event: "resume_optimization_success",
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
        model: "llama-3.3-70b-versatile",
      },
    });
  } catch (error: any) {
    console.error("Resume API error:", {
      error: error?.message,
      status: error?.status,
      code: error?.code,
      timestamp: new Date().toISOString(),
    });

    // Handle specific errors
    if (error?.status === 429) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded for resume optimization",
          suggestion: "Please wait 1-2 minutes before trying again",
        },
        { status: 429 },
      );
    }

    if (error?.status === 401) {
      return NextResponse.json(
        {
          error: "Authentication failed",
          suggestion: "Check your API configuration",
        },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        error: "Resume optimization service unavailable",
        details:
          process.env.NODE_ENV === "development" ? error?.message : undefined,
        suggestion: "Please try again in a few moments",
      },
      { status: 500 },
    );
  }
}
