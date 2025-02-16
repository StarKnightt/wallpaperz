import { imagekitServer } from "@/lib/server/imagekit";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authenticationParameters = imagekitServer.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    console.error("Error generating ImageKit authentication parameters:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Your API logic here using imagekitServer
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

