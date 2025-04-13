"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import ProviderSelect from "@/components/ProviderSelect";
import ProviderProfile from "@/components/ProviderProfile";
import AvailabilitySlots from "@/components/AvailabilitySlots";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
      const res = await fetch("http://localhost:3001/users?role=provider");
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
        `http://localhost:3001/availability/provider/${selectedProvider}`,
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
    setBookingSlotId(slotId);
    const res = await fetch("http://localhost:3001/appointments/request", {
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
      toast.error(error.message || "Failed to book appointment");
    }
    setBookingSlotId(null);
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

  //   return (
  //     <div className="p-6 max-w-2xl mx-auto">
  //       <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>

  //       <label className="block mb-2">Select a provider:</label>
  //       <select
  //         value={selectedProvider || ""}
  //         onChange={(e) => setSelectedProvider(e.target.value)}
  //         className="border rounded p-2 mb-4 w-full"
  //       >
  //         <option value="">-- Choose a provider --</option>
  //         {loadingProviders ? (
  //           <option disabled>Loading providers...</option>
  //         ) : (
  //           providers.map((p) => (
  //             <option key={p.id} value={p.id}>
  //               {p.name}
  //             </option>
  //           ))
  //         )}
  //       </select>

  //       {selectedProvider && availability.length > 0 && (
  //         <div>
  //           <h2 className="text-xl font-semibold mb-2">Available Slots</h2>
  //           {loadingAvailability ? (
  //             <p>Loading availability...</p>
  //           ) : (
  //             <ul className="space-y-2">
  //               {availability.map((slot) => (
  //                 <li
  //                   key={slot.id}
  //                   className="flex justify-between items-center border p-2 rounded"
  //                 >
  //                   <span>{formatSlotTime(slot.start, slot.end)}</span>
  //                   <button
  //                     disabled={bookingSlotId === slot.id}
  //                     onClick={() => handleBooking(slot.id)}
  //                     className={`bg-blue-500 text-white px-4 py-1 rounded ${
  //                       bookingSlotId === slot.id
  //                         ? "opacity-50 cursor-not-allowed"
  //                         : ""
  //                     }`}
  //                   >
  //                     {bookingSlotId === slot.id ? "Booking..." : "Book"}
  //                   </button>
  //                 </li>
  //               ))}
  //             </ul>
  //           )}
  //         </div>
  //       )}

  //       {availability.length === 0 &&
  //         !loadingAvailability &&
  //         selectedProvider && (
  //           <p>No available slots for this provider at the moment.</p>
  //         )}
  //     </div>
  //   );
}
