'use client';
import { useState, useEffect } from "react";
import { fetchServices } from "../utils/fetchServices";

export interface Service {
  service_id: string;
  service_name: string;
  status: string;
  description: string;
  last_updated: string;
  center_id: string;
}

const useFetchServices = () => {
  const [services, setServices] = useState<Array<Service>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchServices();
        setServices(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { services, loading, error }
}

export default useFetchServices;