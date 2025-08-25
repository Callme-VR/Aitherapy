import { NextRequest, NextResponse } from "next/server";

async function handleLogout(req: NextRequest) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
  const token = req.headers.get("Authorization");

  if (!token) {
    return NextResponse.json(
      { message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Logout failed");
    }

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: error.message || "Error during logout" },
      { status: 500 }
    );
  }
}

// Handle both POST and DELETE methods for backward compatibility
export async function POST(req: NextRequest) {
  return handleLogout(req);
}

export async function DELETE(req: NextRequest) {
  return handleLogout(req);
}

export async function GET() {
  return NextResponse.json({ message: "Method not allowed" }, { status: 405 });
}