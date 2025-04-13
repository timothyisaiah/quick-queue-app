'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function BookAppointmentPage() {
  const { data: session } = useSession();
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/users?role=provider') // assuming you have this route
      .then((res) => res.json())
      .then(setProviders);
  }, []);

  const loadAvailability = async (id: string) => {
    setSelectedProvider(id);
    const res = await fetch(`http://localhost:3001/availability/provider/${id}`);
    const data = await res.json();
    setAvailability(data);
  };

  const bookAppointment = async (slotId: string) => {
    await fetch('http://localhost:3001/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        providerId: selectedProvider,
        slotId,
      }),
    });

    alert('Appointment booked!');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>

      <select onChange={(e) => loadAvailability(e.target.value)} className="mb-4">
        <option>Select a Provider</option>
        {providers.map((p: any) => (
          <option key={p.id} value={p.id}>
            {p.email}
          </option>
        ))}
      </select>

      <ul>
        {availability.map((slot: any) => (
          <li key={slot.id} className="flex justify-between items-center">
            {slot.day}: {slot.from} - {slot.to}
            <button onClick={() => bookAppointment(slot.id)} className="ml-2 bg-green-500 px-2 py-1 rounded text-white">
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
