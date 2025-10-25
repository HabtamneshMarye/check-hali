"use client"
import { useState, useEffect } from "react";
import { fetchAppointments } from "../utils/fetchAppointment";
interface AppointmentType {
  appointment_id: string;
  booking_status: string;
  transfer_letter: string;
  appointment_date: string;
  user_id: string;
  center_id: string;
  service_id: string;
}
const useFetchAppointment = () => {
  const [appointments, setAppointments] = useState<Array<AppointmentType>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchAppointments();
        setAppointments(data);
        setError(null);
      } catch (error) {
        setError((error as Error).message);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return { appointments, loading, error };
};
export default useFetchAppointment;





