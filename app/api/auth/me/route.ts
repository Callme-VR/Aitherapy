import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const API_URL = process.env.BACKEND_API_URL as string;
  const token = req.headers.get("Authorization");
  if (!token) {
    return NextResponse.json(
      {
        message: "No token Provided",
      },
      {
        status: 401,
      }
    );
  }
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    return NextResponse.json(
      {
        message: "Error fetching user data",
        error,
      },
      { status: 500 }
    );
  }
}
