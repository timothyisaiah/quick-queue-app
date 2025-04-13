import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  const { email, password, name } = await request.json();

  try {
    const response = await axios.post('http://localhost:3001/auth/register', {
      email,
      password,
      name,
    });
    
    const { token } = response.data;
    
    const res = NextResponse.json({ message: 'Registration successful' });
    res.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    return res;
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}
