'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/utils/api';

type Appointment = {
  id: number;
  clientName: string;
  time: string;
  status: 'pending' | 'accepted' | 'rejected';
};

export default function ProviderAppointments({ token }: { token: string }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`${API_BASE_URL}/appointments/${id}/${action}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      // Refetch to ensure sync with backend
      await fetchAppointments();

      toast.success(`Appointment ${action}ed`);
    } catch {
      toast.error(`Failed to ${action} appointment`);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  if (loading) return <p>Loading appointments...</p>;

  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-lg font-bold">Appointment Requests</h3>
      {appointments.length === 0 && <p>No appointments yet.</p>}

      {appointments.map(app => (
        <div
          key={app.id}
          className="border p-4 rounded-md flex justify-between items-center"
        >
          <div>
            <p>
              <strong>{app.client.name}</strong> —{' '}
              {new Date(app.time).toLocaleString()}
            </p>
            <p className="text-sm">
  Status:{' '}
  <span
    className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
      app.status === 'accepted'
        ? 'bg-green-100 text-green-700'
        : app.status === 'rejected'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}
  >
    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
  </span>
</p>
          </div>

          {app.status === 'pending' && (
            <div className="space-x-2">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(app.id, 'accept')}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => updateStatus(app.id, 'reject')}
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
