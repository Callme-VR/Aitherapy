import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL as string;

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const response = await fetch(
      `${BACKEND_API_URL}/chat/sessions/${sessionId}/history`
    );
     

  } catch (error) {}
}
