"use client";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { HiBadgeCheck, HiCalendar, HiBriefcase } from "react-icons/hi";
import useFetchAppointments from "../hooks/useAppointment";
import useFetchServices from "../hooks/useFetchServices";
import useFetchUsers from "../hooks/useFetchUsers";
import Layout from "../shared-components/Layout";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement);

export function countAppointments(appointments: any[]) {
  let completed = 0;
  let cancelled = 0;
  appointments.forEach((appointment) => {
    if (appointment.booking_status === "Completed") completed++;
    else cancelled++;
  });
  return { completed, cancelled };
}

export function countServices(services: any[]) {
  let arv = 0;
  let counselling = 0;
  let testing = 0;
  services.forEach((service) => {
    const name = service.service_name?.toLowerCase() || "";
    if (name === "arv refills") arv++;
    else if (name === "counselling") counselling++;
    else if (name === "testing") testing++;
  });
  return { arv, counselling, testing };
}

export default function Dashboard() {
  const { users } = useFetchUsers();
  const { appointments } = useFetchAppointments();
  const { services } = useFetchServices();

  const uniquePatientIdsSet = new Set(appointments.map(appoints => appoints.user_id));
  const uniquePatientIds = Array.from(uniquePatientIdsSet);

  const patientsAppointments = users.filter(
    user =>
      uniquePatientIdsSet.has(user.user_id) &&
      user.user_type.toLowerCase() === "patient"
  );

  const dashboardCards = [
    { id: 1, label: "Total Patients", value: uniquePatientIds.length, icon: <HiBadgeCheck /> },
    { id: 2, label: "Appointments", value: appointments.length, icon: <HiCalendar /> },
    { id: 3, label: "Services", value: services.length, icon: <HiBriefcase /> },
  ];

  const appointmentStatus = countAppointments(appointments);
  const appointmentData = {
    labels: ["Completed", "Cancelled"],
    datasets: [
      {
        data: [appointmentStatus.completed, appointmentStatus.cancelled],
        backgroundColor: ["#5A85C5", "#193C6A"],
        borderWidth: 0,
      },
    ],
  };

  const serviceStatus = countServices(services);
  const serviceData = {
    labels: ["ARV Refills", "Counselling", "Testing"],
    datasets: [
      {
        data: [serviceStatus.arv, serviceStatus.counselling, serviceStatus.testing],
        backgroundColor: ["#5A85C5", "#193C6A", "#E8F0FE"],
        borderWidth: 0,
      },
    ],
  };
  const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const countMonths: any = {};
  uniquePatientIds.forEach(patientId => {
    const allAppointments = appointments.filter(appointment => appointment.user_id === patientId);
    let earliestTimestamp = new Date(allAppointments[0].appointment_date).getTime();
    for (let i = 1; i < allAppointments.length; i++) {
      const timestamp = new Date(allAppointments[i].appointment_date).getTime();
      if (timestamp < earliestTimestamp) {
        earliestTimestamp = timestamp;
      }
    }
    const firstDate = new Date(earliestTimestamp);
    const month = monthsArray[firstDate.getMonth()];
    countMonths[month] = (countMonths[month] || 0) + 1;
  });

  const barLabels = monthsArray;
  const barDataSet = monthsArray.map(month => countMonths[month] || 0);

  const monthlyBarData = {
    labels: barLabels,
    datasets: [
      {
        label: "Patients",
        data: barDataSet,
        backgroundColor: "#193C6A",
      },
    ],
  };

  return (
    <div className="flex h-screen bg-[#F6F7FB]">
      <Layout children={undefined} />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pl-8 lg:pl-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="text-xs sm:text-sm px-3 sm:px-4 py-1 rounded bg-[#d4ddf3] text-[#193C6A] flex items-center gap-2">
              <HiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#193C6A]" />
              {new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {dashboardCards.map((card) => (
            <div
              key={card.id}
              className="bg-[#d4ddf3] rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4">
              <div className="bg-[#193C6A] text-white rounded-lg p-2.5 sm:p-3 flex items-center justify-center w-10 sm:w-12 h-10 sm:h-12 text-lg sm:text-2xl">
                {card.icon}
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-[#193C6A]">{card.value}</p>
                <h2 className="text-xs sm:text-sm font-semibold text-[#193C6A]">
                  {card.label}
                </h2>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <div className="bg-[#dae2f6] rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] p-4 sm:p-6 flex flex-col">
            <h3 className="font-semibold mb-3 sm:mb-4 text-[#193C6A] text-sm sm:text-lg">
              Appointments
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-28 sm:w-36 h-28 sm:h-36 flex justify-center items-center">
                <Pie
                  data={appointmentData}
                  options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                {appointmentData.labels.map((status, index) => (
                  <div key={status} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{
                        backgroundColor: appointmentData.datasets[0].backgroundColor[index],
                      }} />
                    <span className="text-[#193C6A] font-semibold text-xs sm:text-sm">{status}</span>
                    <span className="text-[#193C6A] font-bold ml-1 sm:ml-2 text-xs sm:text-sm">
                      {appointmentData.datasets[0].data[index] > 0 && appointments.length > 0
                        ? `${Math.round((appointmentData.datasets[0].data[index] / appointments.length) * 100)}%`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#dae2f6] rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] p-4 sm:p-6 flex flex-col">
            <h3 className="font-semibold mb-3 sm:mb-4 text-[#193C6A] text-sm sm:text-lg">
              Services
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-28 sm:w-36 h-28 sm:h-36 flex justify-center items-center">
                <Doughnut
                  data={serviceData}
                  options={{ responsive: true, maintainAspectRatio: false }}/>
              </div>
              <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                {serviceData.labels.map((mainservice, index) => (
                  <div key={mainservice} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{
                        backgroundColor: serviceData.datasets[0].backgroundColor[index],
                      }} />
                    <span className="text-[#5A85C5] font-semibold text-xs sm:text-sm">{mainservice}</span>
                    <span className="text-[#193C6A] font-bold ml-1 sm:ml-2 text-xs sm:text-sm">
                      {serviceData.datasets[0].data[index] > 0 && services.length > 0
                        ? `${Math.round((serviceData.datasets[0].data[index] / services.length) * 100)}%`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-xl text-[#193C6A]">
            Number of patients
          </h3>
          <div className="h-48 sm:h-64 min-h-[200px] w-full">
            <Bar
              data={monthlyBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    grid: { display: false },
                    ticks: { color: "#193C6A", font: { size: 12, weight: "bold" } },
                  },
                  y: {
                    grid: { color: "#E8F0FE" },
                    ticks: { color: "#193C6A", font: { size: 12 } },
                    beginAtZero: true,
                    max: 20,
                  },
                },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}