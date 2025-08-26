import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  try {
    const response = await fetch(`${API_URL}/api/chat/sessions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: authHeader,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error creating chat session:", error);
    return NextResponse.json(
      { message:"Failed to create chat session" },
      { status: 500 }
    );
  }
}
