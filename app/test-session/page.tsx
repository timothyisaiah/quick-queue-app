
'use client';

import { useSession } from 'next-auth/react';

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Loading session...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>No session found. Please log in.</p>;
  }

  return (
    <div>
      <h1>Session Details</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
