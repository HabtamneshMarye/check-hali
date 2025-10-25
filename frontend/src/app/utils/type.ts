
export interface AppointmentType {
    appointment_id: string;
    booking_status: string;
    transfer_letter: string | null;
    appointment_date: string;
    user_id: string;
    center_id: string;
    service_id: string;
};

export interface ServiceType {
    service_id: string;
    service_name: string;
    status: string;
    description: string;
    last_updated: string;
    center_id: string;
};

export interface UserType {
    user_id: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    user_type: string;
    date_joined: string;
    center_id: string;
};