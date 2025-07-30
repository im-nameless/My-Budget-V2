import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5248';

export async function POST(req: NextRequest) {

  try {
    const body = await req.json();
    const { name, email, password, phone, birthdate } = body;

    // ✅ Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    // 🛰️ Forward data to your external backend (e.g., .NET API)
    const apiResponse = await fetch(`${API_URL}/User`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, birthdate }),
    });

    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      return NextResponse.json(
        { error: result.message || 'Registration failed.' },
        { status: apiResponse.status }
      );
    }

    // ✅ Return response to frontend
    return NextResponse.json(
      { message: 'Usuário cadastrado com sucesso.', user: result, success: true },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error.s' },
      { status: 500 }
    );
  }
}