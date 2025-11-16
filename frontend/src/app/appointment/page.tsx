"use client";
import React, { useState, useMemo } from "react";
import useFetchAppointment from "../hooks/useAppointment";
import useFetchUsers from "../hooks/useUsers";
import useFetchServices from "../hooks/useService";
import Tab from "./components/Tab";
import AppointmentHeader from "./components/Header";
import Sidebar from "../shared-components/Sidebar";
import { FaFileDownload, FaTimesCircle } from "react-icons/fa";


const isDateInRange = (date: Date, start: Date, end: Date) => {
 const apptTime = date.getTime();
  const startTime = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
 const endTime = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59).getTime();


 return apptTime >= startTime && apptTime <= endTime;
};


const statusStyles = {
 Upcoming: "bg-[#10004B] text-white",
 Completed: "bg-[#8AA6F8] text-white",
 Cancelled: "bg-[#F94A7A] text-white",
};


type DateRange = {
 start: Date;
 end: Date;
};


export default function AppointmentPage() {
 const { appointments, loading, error } = useFetchAppointment();
 const { users } = useFetchUsers();
 const { services } = useFetchServices();


 const today = useMemo(() => new Date(), []);
  const [search, setSearch] = useState("");
  const [selectedRange, setSelectedRange] = useState<DateRange>({ start: today, end: today });
 const [selectedLabel, setSelectedLabel] = useState("Today");
 const [activeTab, setActiveTab] = useState("All");
 const [page, setPage] = useState(1);
 const pageSize = 5;


 const setSelectedRangeAndLabel = (range: DateRange, label: string) => {
   setSelectedRange(range);
   setSelectedLabel(label);
   setPage(1);
 };


 const userMap = useMemo(() => {
   const map: { [key: string]: typeof users[0] } = {};
   users.forEach((user) => {
     map[user.user_id] = user;
   });
   return map;
 }, [users]);


 const serviceMap = useMemo(() => {
   const map: { [key: string]: typeof services[0] } = {};
   services.forEach((service) => {
     map[service.service_id] = service;
   });
   return map;
 }, [services]);


 const userAppointmentCounts = useMemo(() => {
   const counts: { [userId: string]: number } = {};
   appointments.forEach(appt => {
     if (userMap[appt.user_id]?.user_type === 'PATIENT') {
       counts[appt.user_id] = (counts[appt.user_id] || 0) + 1;
     }
   });
   return counts;
 }, [appointments, userMap]);


  const filteredAppointments = useMemo(() => {
   return appointments
     .filter((appointment) => {
       const apptDate = new Date(appointment.appointment_date);
       return isDateInRange(apptDate, selectedRange.start, selectedRange.end);
     })
     .filter((appointment) => {
       const user = userMap[appointment.user_id];
       const name = user ? `${user.first_name} ${user.last_name}` : "";
       return name.toLowerCase().includes(search.toLowerCase());
     });
 }, [appointments, selectedRange, search, userMap]);


 const rows = useMemo(() => {
   return filteredAppointments
     .filter(
       (appointment) =>
         activeTab === "All" || appointment.booking_status === activeTab
     )
     .map((appointment, index) => {
       const user = userMap[appointment.user_id];
       const service = serviceMap[appointment.service_id];
       const appointmentCount = userAppointmentCounts[appointment.user_id] || 0;
       const isNew = appointmentCount === 1;
       const patientType = isNew ? "New" : "Existing";
       return {
         id: `${appointment.appointment_id}-${index}`,
         patientName: user ? `${user.first_name} ${user.last_name}` : "",
         contact: user ? user.phone_number : "",
         serviceName: service ? service.service_name : "",
         type: patientType,
         status: appointment.booking_status as "Upcoming" | "Completed" | "Cancelled",
         transferLetterUrl: appointment.transfer_letter,
         isNewPatient: isNew,
       };
     });
 }, [filteredAppointments, activeTab, userMap, serviceMap, userAppointmentCounts]);


 const { allCount, upcomingCount, completedCount, cancelledCount } = useMemo(() => {
   const counts = {
     allCount: filteredAppointments.length,
     upcomingCount: filteredAppointments.filter((a) => a.booking_status === "Upcoming").length,
     completedCount: filteredAppointments.filter((a) => a.booking_status === "Completed").length,
     cancelledCount: filteredAppointments.filter((a) => a.booking_status === "Cancelled").length,
   };
   return counts;
 }, [filteredAppointments]);


 const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
 const paginatedRows = rows.slice((page - 1) * pageSize, page * pageSize);


 const handlePageChange = (newPage: number) => {
   if (newPage >= 1 && newPage <= totalPages) {
     setPage(newPage);
   }
 };


 const handleTabChange = (tabName: string) => {
   setActiveTab(tabName);
   setPage(1);
 };


 const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   setSearch(e.target.value);
   setPage(1);
 };


 const handleViewLetter = (url: string) => {
   if (url) {
     window.open(url, '_blank');
   }
 };


return (
<div className="flex min-h-screen bg-[#FAFAFA]">
 <div className="w-78 flex-shrink-0">
    <Sidebar/>
     </div>
     <div className="flex-1 px-8 py-10">
       <AppointmentHeader
         selectedRange={selectedRange}
         selectedLabel={selectedLabel}
         setSelectedRangeAndLabel={setSelectedRangeAndLabel}
       />
       <div className="mb-4">
         <input
           type="text"
           placeholder="Search by patient name"
           className="border border-gray-300 rounded-lg px-4 py-2 w-1/3 focus:outline-none focus:ring focus:ring-indigo-200"
           onChange={handleSearchChange}
           disabled={loading || !!error}/>
       </div>
       <div className="flex w-full gap-4 mb-2">
         <Tab
           label="All"
           count={allCount}
           active={activeTab === "All"}
           onClick={() => handleTabChange("All")}
           disabled={loading || !!error}/>
         <Tab
           label="Upcoming"
           count={upcomingCount}
           active={activeTab === "Upcoming"}
           onClick={() => handleTabChange("Upcoming")}
           disabled={loading || !!error}/>
         <Tab
           label="Completed"
           count={completedCount}
           active={activeTab === "Completed"}
           onClick={() => handleTabChange("Completed")}
           disabled={loading || !!error}/>
         <Tab
           label="Cancelled"
           count={cancelledCount}
           active={activeTab === "Cancelled"}
           onClick={() => handleTabChange("Cancelled")}
           disabled={loading || !!error}/>
 </div>
  <div className="bg-white rounded-lg shadow-md p-6">
 <div className="overflow-x-auto">
  <table className="w-full min-w-[700px] table-fixed text-base table-separate border-spacing-0">
      <thead>
 <tr className="text-left text-[#10004B] font-bold text-base">
 <th className="py-2 px-2 whitespace-nowrap">Patients</th>
 <th className="py-2 px-2 whitespace-nowrap">Contacts</th>
 <th className="py-2 px-2 whitespace-nowrap">Service Name</th>
 <th className="py-2 px-2 whitespace-nowrap">Type</th>
 <th className="py-2 px-2 whitespace-nowrap">Status</th>
  <th className="py-2 px-2 whitespace-nowrap text-center">Letter</th>
   </tr>
   </thead>
   <tbody>
      {loading ? (
      <tr>
      <td colSpan={6} className="text-center py-6 text-[#10004B]">
                 Loading...
          </td>
         </tr>
       ) : error ? (
        <tr>
    <td colSpan={6} className="text-center py-6 text-red-500 font-bold">
         Error: {error}
    </td>
        </tr>
          ) : paginatedRows.length === 0 ? (
       <tr>
     <td
    colSpan={6}
        className="text-center py-6 text-[#10004B]/70 font-medium">
             No appointments found for the selected range.
        </td>
      </tr>
    ) : (
       paginatedRows.map((a) => (
       <tr
         key={a.id}
         className="font-medium text-[#10004B] text-base">
        <td className="py-2 px-2 whitespace-nowrap">{a.patientName}</td>
       <td className="py-2 px-2 whitespace-nowrap">{a.contact}</td>
       <td className="py-2 px-2 whitespace-nowrap">{a.serviceName}</td>
      <td className="py-2 px-2 whitespace-nowrap">{a.type}</td>
      <td className="py-2 px-2 whitespace-nowrap">
      <span
        className={`px-4 py-2 rounded-lg text-base font-bold inline-block text-center ${statusStyles[a.status as keyof typeof statusStyles]} min-w-[90px]`} >
           {a.status}
            </span>
             </td>
             <td className="py-2 px-2 whitespace-nowrap text-center">
                {a.isNewPatient ? (
        a.transferLetterUrl ? (
      <button
        onClick={(e) => {
      e.stopPropagation();
      handleViewLetter(a.transferLetterUrl as string);
   }}
  className="text-[#4767A9] hover:text-[#233876] transition-colors p-2"
     title="View Transfer Letter (Uploaded)">
            <FaFileDownload size={20} />
        </button>
              ) : (
<span className="text-red-500" title="Transfer Letter Required (Missing)">
  <FaTimesCircle size={20} />
     </span>
     )
     ) : (
<span className="text-gray-400 font-normal" title="Not Required">
       &mdash;
     </span>
     )}
    </td>
</tr>
    ))
      )}
 </tbody>
  </table>
    </div>
    <div className="flex justify-center items-center gap-4 mt-4">
   <button
      onClick={() => handlePageChange(page - 1)}
    className={`px-4 py-2 rounded transition-colors ${page === 1 || loading || !!error
       ? "bg-gray-300 cursor-not-allowed text-gray-600"
    : "bg-[#001F54] hover:bg-[#9FC5E8] text-white"
  }`}
  disabled={page === 1 || loading || !!error}
    >
      Previous
    </button>
    <button
      onClick={() => handlePageChange(page + 1)}
    className={`px-4 py-2 rounded transition-colors ${page === totalPages || loading || !!error
                 ? "bg-gray-300 cursor-not-allowed text-gray-600"
                 : "bg-[#001F54] hover:bg-[#9FC5E8] text-white"
               }`}
             disabled={page === totalPages || loading || !!error}>
             Next
           </button>
         </div>
       </div>
     </div>
   </div>
 );
}

