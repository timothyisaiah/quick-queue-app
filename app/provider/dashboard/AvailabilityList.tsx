'use client';

import { format, parseISO } from 'date-fns';

type Availability = {
  id: number;
  start: string;
  end: string;
};

export default function AvailabilityList({
  availabilities,
  deleteSlot,
}: {
  availabilities: Availability[];
  deleteSlot: (id: number) => void;
}) {
  if (availabilities.length === 0) {
    return <p className="text-sm text-gray-500">No availability slots added yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {availabilities.map((a) => {
        const startDate = parseISO(a.start);
        const endDate = parseISO(a.end);

        const day = format(startDate, 'EEEE, MMMM d'); // e.g., Monday, April 14
        const from = format(startDate, 'HH:mm');
        const to = format(endDate, 'HH:mm');

        return (
          <li key={a.id} className="flex justify-between items-center border-b pb-1">
            <span>{day}: {from} - {to}</span>
            <button
              onClick={() => deleteSlot(a.id)}
              className="text-red-500 hover:underline"
            >
              🗑️
            </button>
          </li>
        );
      })}
    </ul>
  );
}
