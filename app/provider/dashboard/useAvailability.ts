'use client';

import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/utils/api';

export function useAvailability(token?: string) {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailability = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/availability`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch availability');

      const data = await res.json();
      setAvailabilities(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addSlot = useCallback(
    async (start: string, end: string) => {
      if (!token) throw new Error('No token provided');

      const startDate = new Date(start);
      const endDate = new Date(end);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        console.error('Invalid date input:', { start, end });
        throw new Error('Invalid date input');
      }

      const payload = {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };

      const res = await fetch(`${API_BASE_URL}/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to add slot');
      }

      await fetchAvailability();
      return res.json();
    },
    [token, fetchAvailability]
  );

  const deleteSlot = useCallback(
    async (id: string) => {
      if (!token) throw new Error('No token provided');
      try{
      await fetch(`${API_BASE_URL}/availability/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Availability slot deleted!');
      await fetchAvailability();
    }catch (err){
      toast.error('Failed to delete slot');
      console.error(err)
    }
    },
    [token, fetchAvailability]
  );

  useEffect(() => {
    if (token) fetchAvailability();
  }, [token, fetchAvailability]);

  return {
    availabilities,
    loading,
    addSlot,
    deleteSlot,
  };
}
