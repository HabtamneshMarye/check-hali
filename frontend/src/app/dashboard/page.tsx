"use client";
import React, { useMemo, useState } from "react";
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement } from "chart.js";
import { HiBadgeCheck, HiCalendar } from "react-icons/hi";
import useFetchAppointments from "../hooks/useAppointment";
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

function startOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - ((day + 6) % 7);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfWeek(date: Date) {
  const s = startOfWeek(date);
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  e.setHours(23, 59, 59, 999);
  return e;
}
function startOfMonth(date: Date) {
  const s = new Date(date.getFullYear(), date.getMonth(), 1);
  s.setHours(0, 0, 0, 0);
  return s;
}
function endOfMonth(date: Date) {
  const e = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  e.setHours(23, 59, 59, 999);
  return e;
}
function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export default function Dashboard() {
  const { users } = useFetchUsers();
  const { appointments } = useFetchAppointments();

  const [filterMode, setFilterMode] = useState<"Daily" | "Weekly" | "Monthly">("Weekly");
  const [anchorDateString, setAnchorDateString] = useState<string>(new Date().toISOString().slice(0, 10));

  const anchorDate = useMemo(() => {
    if (!anchorDateString) return new Date();
    return anchorDateString.length === 7 ? new Date(anchorDateString + "-01T00:00:00") : new Date(anchorDateString + "T00:00:00");
  }, [anchorDateString]);

  const { periodStart, periodEnd } = useMemo(() => {
    if (filterMode === "Weekly") {
      return { periodStart: startOfWeek(anchorDate), periodEnd: endOfWeek(anchorDate) };
    } else if (filterMode === "Monthly") {
      return { periodStart: startOfMonth(anchorDate), periodEnd: endOfMonth(anchorDate) };
    } else {
      return { periodStart: startOfDay(anchorDate), periodEnd: endOfDay(anchorDate) };
    }
  }, [filterMode, anchorDate]);

  const parseDate = (d: any) => {
    const date = new Date(d);
    return isNaN(date.getTime()) ? null : date;
  };

  const filteredAppointments = useMemo(() => {
    return (appointments || []).filter((appt) => {
      const dt = parseDate(appt.appointment_date);
      if (!dt) return false;
      return dt >= periodStart && dt <= periodEnd;
    });
  }, [appointments, periodStart, periodEnd]);

  const uniquePatientIdsFiltered = useMemo(() => {
    const s = new Set<string | number>();
    (filteredAppointments || []).forEach((a) => s.add(a.user_id));
    return Array.from(s);
  }, [filteredAppointments]);

  const dashboardCards = [
    { id: 1, label: "Total Patients", value: uniquePatientIdsFiltered.length, icon: <HiBadgeCheck /> },
    { id: 2, label: "Appointments", value: filteredAppointments.length, icon: <HiCalendar /> },
  ];

  const appointmentStatus = countAppointments(filteredAppointments);
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

  const userMap: { [key: string]: any } = {};
  (users || []).forEach((u) => {
    userMap[u.user_id] = u;
  });

  const newExistingCounts = useMemo(() => {
    let newCount = 0;
    let existingCount = 0;
    const allAppointments = appointments || [];
    const userAppointmentCounts: Record<string, number> = {};
    allAppointments.forEach((a) => {
      const uid = a.user_id;
      const u = userMap[uid];
      if (!u) return;
      if ((u.user_type || "").toString().toLowerCase() !== "patient") return;
      userAppointmentCounts[uid] = (userAppointmentCounts[uid] || 0) + 1;
    });
    let uniqueIdsToCheck: Array<string | number> = [];
    uniqueIdsToCheck = uniquePatientIdsFiltered.filter((id) => {
      const u = userMap[id];
      return !!u && (u.user_type || "").toString().toLowerCase() === "patient";
    });

    uniqueIdsToCheck.forEach((uid) => {
      const count = userAppointmentCounts[uid as string] || 0;
      if (count === 1) newCount++;
      else if (count > 1) existingCount++;
    });
    return { newCount, existingCount };
  }, [appointments, users, uniquePatientIdsFiltered, filterMode]);

  const newExistingData = {
    labels: ["New Patients", "Existing Patients"],
    datasets: [
      {
        data: [newExistingCounts.newCount, newExistingCounts.existingCount],
        backgroundColor: ["#5A85C5", "#193C6A"],
        borderWidth: 0,
      },
    ],
  };

  const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const monthlyCounts = useMemo(() => {
    const patientsPerMonth: Record<number, Set<string | number>> = {};
    for (let i = 0; i < 12; i++) patientsPerMonth[i] = new Set();
    const allAppointments = appointments || [];
    allAppointments.forEach((a) => {
      const dt = parseDate(a.appointment_date);
      if (!dt) return;
      const uid = a.user_id;
      const u = userMap[uid];
      if (!u) return;
      if ((u.user_type || "").toString().toLowerCase() !== "patient") return;
      const month = dt.getMonth();
      patientsPerMonth[month].add(uid);
    });
    return monthsArray.map((_, i) => patientsPerMonth[i].size);
  }, [appointments, users]);

  const maxVal = useMemo(() => {
    const m = Math.max(1, ...monthlyCounts);
    return m;
  }, [monthlyCounts]);

  const suggestedMax = useMemo(() => {
    if (maxVal <= 10) return 10;
    const pow = Math.pow(10, Math.floor(Math.log10(maxVal)));
    const factor = Math.ceil(maxVal / pow);
    return pow * (factor <= 2 ? 2 : factor <= 5 ? 5 : 10);
  }, [maxVal]);

  const monthlyBarData = {
    labels: monthsArray,
    datasets: [
      {
        label: "Patients",
        data: monthlyCounts,
        backgroundColor: "#193C6A",
      },
    ],
  };

  const formatHeaderDate = () => {
    if (filterMode === "Weekly") {
      const s = startOfWeek(anchorDate);
      const e = endOfWeek(anchorDate);
      const sStr = s.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      const eStr = e.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
      return `${sStr} - ${eStr}`;
    } else if (filterMode === "Monthly") {
      return anchorDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    } else {
      return anchorDate.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    }
  };

  return (
    <div className="flex h-screen bg-[#F6F7FB]">
      <Layout children={undefined} />
      <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8 pl-8 lg:pl-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <div className="text-xs sm:text-sm px-3 sm:px-4 py-1 rounded bg-[#d4ddf3] text-[#193C6A] flex items-center gap-3">
              <HiCalendar className="h-5 w-5 sm:h-6 sm:w-6 text-[#193C6A]" />
              <div className="hidden sm:flex flex-col">
                <span className="font-semibold text-xs sm:text-sm">{formatHeaderDate()}</span>
                <span className="text-[10px] text-[#193C6A] opacity-75">{`${filterMode} view`}</span>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value as any)}
                  className="px-2 py-1 rounded bg-white border text-xs sm:text-sm"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                {filterMode === "Monthly" ? (
                  <input
                    type="month"
                    value={anchorDateString.slice(0, 7)}
                    onChange={(e) => setAnchorDateString(e.target.value)}
                    className="px-2 py-1 rounded bg-white border text-xs sm:text-sm"
                    title="Choose month and year"
                  />
                ) : (
                  <input
                    type="date"
                    value={anchorDateString.length === 7 ? anchorDateString + "-01" : anchorDateString}
                    onChange={(e) => setAnchorDateString(e.target.value)}
                    className="px-2 py-1 rounded bg-white border text-xs sm:text-sm"
                    title="Choose date to anchor day/week"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
            <span className="text-xs sm:text-sm px-3 sm:px-4 py-1 rounded bg-transparent text-[#193C6A] flex items-center gap-2">
              <span className="sr-only">Dashboard</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                      {appointmentData.datasets[0].data[index] > 0 && filteredAppointments.length > 0
                        ? `${Math.round((appointmentData.datasets[0].data[index] / filteredAppointments.length) * 100)}%`
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#dae2f6] rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] p-4 sm:p-6 flex flex-col">
            <h3 className="font-semibold mb-3 sm:mb-4 text-[#193C6A] text-sm sm:text-lg">
              New vs Existing Patients
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-28 sm:w-36 h-28 sm:h-36 flex justify-center items-center">
                <Pie
                  data={newExistingData}
                  options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
              <div className="flex flex-col gap-2 mt-4 sm:mt-0">
                {newExistingData.labels.map((label, index) => (
                  <div key={label} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                      style={{
                        backgroundColor: newExistingData.datasets[0].backgroundColor[index],
                      }} />
                    <span className="text-[#5A85C5] font-semibold text-xs sm:text-sm">{label}</span>
                    <span className="text-[#193C6A] font-bold ml-1 sm:ml-2 text-xs sm:text-sm">
                      {newExistingData.datasets[0].data[index] > 0
                        ? `${newExistingData.datasets[0].data[index]}`
                        : "0"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-[0_4px_12px_0_rgba(25,60,106,0.1)] p-4 sm:p-6 mb-6 sm:mb-8">
          <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-xl text-[#193C6A]">
            Number of patients per month
          </h3>
          <div className="h-48 sm:h-64 min-h-[200px] w-full">
            <Bar
              data={monthlyBarData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { display: false }, ticks: { color: "#193C6A", font: { size: 12, weight: "bold" } } },
                  y: {
                    grid: { color: "#E8F0FE" },
                    ticks: {
                      color: "#193C6A",
                      font: { size: 12 },
                      callback(value: any) {
                        const v = Number(value);
                        if (v >= 1000) return v >= 1000000 ? `${v / 1000000}M` : `${v / 1000}k`;
                        return `${v}`;
                      },
                      stepSize: Math.max(1, Math.ceil(suggestedMax / 5)),
                    },
                    beginAtZero: true,
                    suggestedMax: suggestedMax,
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