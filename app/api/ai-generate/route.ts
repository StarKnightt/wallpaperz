import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { AI_LIMITS, reserveGeneration } from '@/lib/server/ai-rate-limit'

// Define the response type from Stability AI
interface GenerationResponse {
  artifacts: Array<{
    base64: string;
    seed: number;
    finishReason: string;
  }>;
}

const MAX_PROMPT_LENGTH = 1000

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate before reserving a slot so bad requests don't count
    const body = await req.json().catch(() => ({}));
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim().slice(0, MAX_PROMPT_LENGTH) : '';
    const negative_prompt = typeof body.negative_prompt === 'string' ? body.negative_prompt.trim().slice(0, MAX_PROMPT_LENGTH) : '';

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const apiKey = process.env.DREAMSTUDIO_API_KEY;
    if (!apiKey) {
      console.error("DreamStudio API key is not configured");
      return NextResponse.json(
        { error: "AI generation service is not configured properly" }, 
        { status: 500 }
      );
    }

    const rateLimit = await reserveGeneration(userId)
    const limitHeaders = {
      'X-RateLimit-Limit': String(AI_LIMITS.perUserPerHour),
      'X-RateLimit-Remaining': String(rateLimit.remaining),
      'X-RateLimit-Reset': String(rateLimit.resetTime),
    }
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime)
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again later.",
          resetTime: resetDate.toISOString(),
          message: rateLimit.reason === 'global'
            ? "The generator is taking a breather after a busy day. Please try again later."
            : `You've reached the maximum of ${AI_LIMITS.perUserPerHour} generations per hour. Resets at ${resetDate.toLocaleTimeString()}`,
        },
        { status: 429, headers: limitHeaders }
      );
    }

    // 16:9 widescreen dimensions (SDXL supported pair)
    const width = 1344;
    const height = 768;
    const cfg_scale = 7;
    const steps = 30;
    
    // Engine ID - using the latest stable model
    const engine_id = "stable-diffusion-xl-1024-v1-0";

    let response: Response
    try {
      response = await fetch(
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
    } catch (error) {
      await rateLimit.release()
      throw error
    }

    if (!response.ok) {
      await rateLimit.release()
      const error = await response.json().catch(() => ({}));
      console.error("DreamStudio API error:", error);
      return NextResponse.json(
        { error: "Failed to generate image" },
        { status: response.status === 400 ? 400 : 502 }
      );
    }

    const responseData: GenerationResponse = await response.json();
    
    // Extract the base64 image from the response
    const generatedImage = responseData.artifacts[0]?.base64;
    if (!generatedImage) {
      await rateLimit.release()
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
      { headers: limitHeaders }
    );

  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
