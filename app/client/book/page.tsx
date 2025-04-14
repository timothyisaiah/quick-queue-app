"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProviderSelect from "@/components/ProviderSelect";
import ProviderProfile from "@/components/ProviderProfile";
import AvailabilitySlots from "@/components/AvailabilitySlots";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from '@/lib/utils/api';

type Provider = {
  id: string;
  name: string;
};

type Availability = {
  id: string;
  start: string;
  end: string;
};

export default function BookAppointmentPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(true);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingSlotId, setBookingSlotId] = useState<string | null>(null);

  const selectedProviderDetails =
    providers.find((p) => p.id === selectedProvider) || null;

  // Fetch list of providers
  useEffect(() => {
    const fetchProviders = async () => {
      const res = await fetch(`${API_BASE_URL}/users?role=provider`);
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
      } else {
        console.error("Failed to fetch providers");
      }
      setLoadingProviders(false);
    };
    fetchProviders();
  }, []);

  // Fetch availability for selected provider
  useEffect(() => {
    if (status !== "authenticated" || !selectedProvider) return;

    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      const res = await fetch(
        `${API_BASE_URL}/availability/provider/${selectedProvider}`,
        {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setAvailability(data);
      } else {
        console.error("Failed to fetch availability");
      }
      setLoadingAvailability(false);
    };

    fetchAvailability();
  }, [selectedProvider, session?.user?.accessToken]);

  // Handle booking of appointment
  const handleBooking = async (slotId: string) => {
    try {
      setBookingSlotId(slotId);
  
      const res = await fetch(`${API_BASE_URL}/appointments/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify({
          providerId: selectedProvider,
          availabilityId: slotId,
        }),
      });
  
      const result = await res.json();
  
      if (res.ok) {
        setAvailability((prev) => prev.filter((slot) => slot.id !== slotId)); // Remove booked slot
        toast.success("Appointment request sent!");
        await router.push("/client/appointments");
      } else {
        console.error("Booking failed:", result);
        toast.error(result?.message || "Failed to book appointment");
      }
    } catch (err: any) {
      console.error("An error occurred while booking:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setBookingSlotId(null);
    }
  };
  
  // Time formatting function
  const formatSlotTime = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} ${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`;
  };

  // Guard clause if no session
  if (!session) {
    return (
      <p className="text-center mt-10">Please login to book an appointment.</p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/client/appointments" className="text-blue-600 underline">
        View My Appointments →
      </Link>
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

      <ProviderSelect
        providers={providers}
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
      />

      {selectedProviderDetails && (
        <ProviderProfile provider={selectedProviderDetails} />
      )}

      {availability.length > 0 && (
        <AvailabilitySlots availability={availability} onBook={handleBooking} />
      )}
    </div>
  );
}
