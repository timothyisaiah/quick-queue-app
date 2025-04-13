'use client';

import { format, parseISO } from 'date-fns';

type Availability = {
  id: number;
  start: string; // ISO string
  end: string;   // ISO string
};

export default function AvailabilityCalendar({
  availabilities,
  onDelete,
}: {
  availabilities: Availability[];
  onDelete: (id: number) => void;
}) {
  // Group slots by day
  const grouped = availabilities.reduce<Record<string, Availability[]>>((acc, slot) => {
    const day = format(parseISO(slot.start), 'yyyy-MM-dd');
    if (!acc[day]) acc[day] = [];
    acc[day].push(slot);
    return acc;
  }, {});

  const sortedDays = Object.keys(grouped).sort();

  return (
    <div className="space-y-4">
      {sortedDays.map((day) => (
        <div key={day} className="bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">{format(parseISO(day), 'eeee, MMMM d')}</h3>
          <ul className="space-y-2">
            {grouped[day].map((slot) => (
              <li
                key={slot.id}
                className="flex justify-between items-center bg-gray-800 p-2 rounded shadow-sm border"
              >
                <span>
                  {format(parseISO(slot.start), 'hh:mm a')} - {format(parseISO(slot.end), 'hh:mm a')}
                </span>
                <button
                  onClick={() => onDelete(slot.id)}
                  className="text-red-500 hover:underline"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
