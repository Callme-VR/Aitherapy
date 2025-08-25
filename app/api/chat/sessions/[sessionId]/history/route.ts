import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function GET(
  req: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    console.log(`Getting histroy chat session ${sessionId}`);
    const response = await fetch(
      `${API_URL}/api/chat/sessions/${sessionId}/history`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      }
    );
    if (!response.ok) {
      const error = await response.json();
      console.error("Error in fetching chat history", error);
      return NextResponse.json(error, { status: response.status });
    }
    const data = await response.json();
    console.log("chat history fetched successfully", data);

    const formattedMessages = data.map((msg: any) => {
      return {
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
      };
    });

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return NextResponse.json(
      {
        message: "Failed to fetch chat history",
      },
      { status: 500 }
    );
  }
}
