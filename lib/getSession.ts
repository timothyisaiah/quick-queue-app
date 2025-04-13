export async function getSession() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) return null;
  
    try {
      const res = await fetch('http://localhost:3001/auth/session', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!res.ok) throw new Error('Failed to fetch session');
  
      const data = await res.json();
      return data.user;
    } catch (err) {
      console.error('Session fetch failed:', err);
      return null;
    }
  }
  