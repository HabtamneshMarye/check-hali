'use client';
import { useState, useEffect } from 'react';
import { fetchServices } from '../utils/fetchServices';

interface Service {
 service_id: string;
 service_name: string;
 status: string;
 description: string;
 center_id: string;
}

const useFetchServices = () => {
 const [services, setServices] = useState<Service[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<string | null>(null);
 const [refreshKey, setRefreshKey] = useState(0);


 useEffect(() => {
   const loadServices = async () => {
     setLoading(true);
     setError(null);
     try {
       const services = await fetchServices();
       setServices(services);
     } catch (error) {
    setError((error as Error).message);
     } finally {
       setLoading(false);
     }
   };

   loadServices();
 }, [refreshKey]);

 const refetch = () => {
   setRefreshKey(prev => prev + 1);
 };

 return { services, loading, error, refetch, setServices };

};

export default useFetchServices;
