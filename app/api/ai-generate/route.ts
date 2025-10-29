import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'

// Define the response type from Stability AI
interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

// Simple in-memory rate limiter
// In production, use Redis or a database
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT = {
  maxRequests: 5, // Max requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
}

function checkRateLimit(userId: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const userLimit = rateLimitMap.get(userId)

  if (!userLimit || now > userLimit.resetTime) {
    // Reset or create new limit
    const resetTime = now + RATE_LIMIT.windowMs
    rateLimitMap.set(userId, { count: 1, resetTime })
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1, resetTime }
  }

  if (userLimit.count >= RATE_LIMIT.maxRequests) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: userLimit.resetTime }
  }

  // Increment count
  userLimit.count++
  rateLimitMap.set(userId, userLimit)
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - userLimit.count, resetTime: userLimit.resetTime }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit
    const rateLimit = checkRateLimit(userId)
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime)
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again later.",
          resetTime: resetDate.toISOString(),
          message: `You've reached the maximum of ${RATE_LIMIT.maxRequests} generations per hour. Resets at ${resetDate.toLocaleTimeString()}`
        }, 
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
            'X-RateLimit-Reset': String(rateLimit.resetTime),
          }
        }
      );
    }

    // Parse the request body
    const body = await req.json();
    const { prompt, negative_prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Fixed dimensions - use default square format for best quality
    const width = 1024;
    const height = 1024;
    const cfg_scale = 7;
    const steps = 30;
    
    // Engine ID - using the latest stable model
    const engine_id = "stable-diffusion-xl-1024-v1-0";

    // Call the DreamStudio API
    const apiKey = process.env.DREAMSTUDIO_API_KEY;
    if (!apiKey) {
      console.error("DreamStudio API key is not configured");
      return NextResponse.json(
        { error: "AI generation service is not configured properly" }, 
        { status: 500 }
      );
    }

    console.log(`Generating image with prompt:`, prompt);
    
    const response = await fetch(
      `https://api.stability.ai/v1/generation/${engine_id}/text-to-image`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1,
            },
            ...(negative_prompt ? [{
              text: negative_prompt,
              weight: -1,
            }] : []),
          ],
          cfg_scale,
          height,
          width,
          steps,
          samples: 1,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("DreamStudio API error:", error);
      return NextResponse.json(
        { error: "Failed to generate image", details: error }, 
        { status: response.status }
      );
    }

    const responseData: GenerationResponse = await response.json();
    
    // Extract the base64 image from the response
    const generatedImage = responseData.artifacts[0]?.base64;
    if (!generatedImage) {
      return NextResponse.json(
        { error: "No image was generated" }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        image: `data:image/png;base64,${generatedImage}`,
        seed: responseData.artifacts[0]?.seed,
      },
      {
        headers: {
          'X-RateLimit-Limit': String(RATE_LIMIT.maxRequests),
          'X-RateLimit-Remaining': String(rateLimit.remaining),
          'X-RateLimit-Reset': String(rateLimit.resetTime),
        }
      }
    );

  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "AI generation failed", details: String(error) }, 
      { status: 500 }
    );
  }
}
