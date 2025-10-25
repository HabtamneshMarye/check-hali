
'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchClinics } from '../utils/fetchClinics';

export interface Clinic {
  center_id: string;
  center_name: string;
  center_type: string;
  image_path: string | null;
  address: string;
  latitude: number;
  longitude: number;
  contact_number: string;
  operational_status: 'Open' | 'Closed';
  opening_time: string;
  closing_time: string;
  updated_at: string;
  user: string;
}

const useFetchClinics = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchClinics();
      setClinics(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { clinics, loading, error, refetch: fetchData };
};

export default useFetchClinics;