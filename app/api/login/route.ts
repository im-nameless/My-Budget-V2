import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5248';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  console.log('Login request:', { email, password });

  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  console.log('API response status:', response);

  const data = await response.json();

  console.log('API response data:', data);

  if (!response.ok) {
    return NextResponse.json({ error: data.error || 'Login failed' }, { status: response.status });
  }

  return NextResponse.json(
    { data: data, success: true },
    { status: 201 }
  );
}