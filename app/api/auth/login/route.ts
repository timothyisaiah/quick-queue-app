import { NextResponse } from 'next/server'; 
import axios from 'axios';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const response = await axios.post('http://localhost:3001/auth/login', {
      email,
      password,
    });

    const data = response.data;

    if (response.status === 200) {
      const cookieStore = cookies();
      cookieStore.set('token', data.access_token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      cookieStore.set('user', JSON.stringify(data.user), {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      const redirectPath = data.user.role === 'provider' ? '/dashboard' : '/book';
      return NextResponse.redirect(new URL(redirectPath, request.url));
    } else {
      return NextResponse.json({ error: 'Login failed' }, { status: 401 });
    }
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }
}
