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
    
  } catch () {
    
  }
}
