'use client';

import { useSession } from 'next-auth/react';
import { useAvailability } from '@/app/provider/dashboard/useAvailability';
import { AvailabilityForm } from '@/app/provider/dashboard/AvailabilityForm';
import AvailabilityList from '@/app/provider/dashboard/AvailabilityList';
import AvailabilityCalendar from '@/app/provider/dashboard/AvailabilityCalendar';
import { useState } from 'react';

export default function ProviderDashboard() {
  const { data: session, status } = useSession();
  const token = session?.user.accessToken;
  const [view, setView] = useState<'list' | 'calendar'>('calendar');

  const { availabilities, deleteSlot, addSlot, loading } = useAvailability(token);

  if (status === 'loading') return <p>Loading session...</p>;
  if (!session || !session.user || !token) {
    return <p>You must be logged in to view your dashboard.</p>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your Availability</h2>
        <div className="space-x-2">
          <button
            className={`px-3 py-1 rounded ${view === 'list' ? 'bg-blue-500 text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
          <button
            className={`px-3 py-1 rounded ${view === 'calendar' ? 'bg-blue-500 text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('calendar')}
          >
            Calendar View
          </button>
        </div>
      </div>

      <AvailabilityForm addSlot={addSlot} />

      {loading ? (
        <p>Loading availability...</p>
      ) : view === 'list' ? (
        <AvailabilityList availabilities={availabilities} onDelete={deleteSlot} />
      ) : (
        <AvailabilityCalendar availabilities={availabilities} onDelete={deleteSlot} />
      )}
    </div>
  );
}
