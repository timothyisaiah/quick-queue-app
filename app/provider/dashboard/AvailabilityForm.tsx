'use client';

import { useState } from 'react';
import { toast } from 'sonner';

interface AvailabilityFormProps {
  addSlot: (start: string, end: string) => Promise<void>;
}

export function AvailabilityForm({ addSlot }: AvailabilityFormProps) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!start || !end) {
      toast.error('Start and End are required');
      return;
    }

    try {
      await addSlot(start, end);
      setStart('');
      setEnd('');
      toast.success('Availability slot added!');
    } catch (err: any) {
      console.error(err);
      toast.error('Failed to add slot');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-4">
      <div className="flex gap-2">
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} className="border p-2 rounded" />
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} className="border p-2 rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </div>
    </form>
  );
}
