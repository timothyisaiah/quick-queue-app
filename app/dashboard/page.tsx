'use client';

import { useEffect, useState } from 'react';
import { getSession } from '@/lib/getSession';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      const sessionUser = await getSession();

      if (!sessionUser) {
        router.push('/login'); // not logged in
      } else {
        setUser(sessionUser);
      }
    }

    loadUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Welcome back, {user.email}</h1>
      <p className="mt-2 text-sm text-gray-500">Role: {user.role}</p>
    </div>
  );
}
