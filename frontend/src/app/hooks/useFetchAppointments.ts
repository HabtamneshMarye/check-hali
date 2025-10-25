import { useEffect, useState } from "react";
import { fetchAppointments } from "../utils/fetchAppointments";
import { AppointmentType } from "../utils/type";

const useFetchAppointments = () => {
    const [appointments, setAppointments] = useState<Array<AppointmentType>>([]);
    const [appointmentsloading, setLoading] = useState<boolean>(true);
    const [appointmentserror, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const appointments = await fetchAppointments();
                setAppointments(Array.isArray(appointments) ? appointments : []);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        })();
    }, []); 

    return { appointments,appointmentsloading, appointmentserror };
};

export default useFetchAppointments;
