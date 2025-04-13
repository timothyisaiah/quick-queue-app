'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function ProviderDashboard() {
  const { data: session } = useSession();
  const [availabilities, setAvailabilities] = useState([]);
  const [day, setDay] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchAvailability = async () => {
    const res = await fetch('http://localhost:3001/availability', {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    const data = await res.json();
    setAvailabilities(data);
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchAvailability();
    }
  }, [session]);

  const handleAdd = async () => {
    await fetch('http://localhost:3001/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ day, from, to }),
    });
    setDay('');
    setFrom('');
    setTo('');
    fetchAvailability();
  };

  const handleDelete = async (id: string) => {
    await fetch(`http://localhost:3001/availability/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
      },
    });
    fetchAvailability();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Availability</h2>

      <div className="mb-4">
        <input value={day} onChange={(e) => setDay(e.target.value)} placeholder="Day (e.g. Monday)" />
        <input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From (e.g. 09:00)" />
        <input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To (e.g. 17:00)" />
        <button onClick={handleAdd}>Add Slot</button>
      </div>

      <ul>
        {availabilities.map((a: any) => (
          <li key={a.id} className="flex justify-between">
            {a.day}: {a.from} - {a.to}
            <button onClick={() => handleDelete(a.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
