import AppointmentsClient from "@/components/clients/AppointmentsClient";

export default function AppointmentsPage() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Appointments</h1>
      <AppointmentsClient />
    </div>
  );
}
