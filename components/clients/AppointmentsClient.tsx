'use client';

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import AppointmentList from "@/components/clients/AppointmentList";
import { toast } from "sonner";

type Appointment = {
  id: number;
  time: string;
  status: string;
  provider: { name: string };
};

export default function AppointmentsClient() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!session?.user?.accessToken) return;

      try {
        const res = await fetch("http://localhost:3001/appointments", {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        setAppointments(data);
      } catch (err) {
        toast.error("Error fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [session]);

  if (loading) return <p>Loading...</p>;

  return <AppointmentList appointments={appointments} />;
}
