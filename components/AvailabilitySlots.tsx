import { FC } from 'react';

interface Availability {
  id: string;
  start: string;
  end: string;
}

interface AvailabilitySlotsProps {
  availability: Availability[];
  onBook: (slotId: string) => void;
}

const AvailabilitySlots: FC<AvailabilitySlotsProps> = ({ availability, onBook }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Available Slots</h2>
      <ul className="space-y-2">
        {availability.map((slot) => (
          <li key={slot.id} className="flex justify-between items-center border p-2 rounded">
            <span>{new Date(slot.start).toLocaleString()} - {new Date(slot.end).toLocaleTimeString()}</span>
            <button
              onClick={() => onBook(slot.id)}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AvailabilitySlots;
