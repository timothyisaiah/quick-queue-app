type Appointment = {
  id: number;
  time: string;
  status: string;
  provider: { name: string };
};

export default function AppointmentList({
  appointments,
}: {
  appointments: Appointment[];
}) {
  if (!appointments.length) return <p>No appointments yet.</p>;

  return (
    <ul className="space-y-3">
      {appointments.map((appt) => (
        <li
          key={appt.id}
          className="border rounded-xl p-4 shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="text-lg font-medium">{appt.provider.name}</p>
            <p className="text-sm text-gray-600">
              {new Date(appt.time).toLocaleString()}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              appt.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : appt.status === "accepted"
                ? "bg-green-100 text-green-800"
                : appt.status === "rejected"
                ? "bg-red-100 text-red-800"
                : ""
            }`}
          >
            {appt.status}
          </span>
        </li>
      ))}
    </ul>
  );
}
