"use client";
import React, { useState, useRef, useEffect } from "react";
import { MdCalendarToday, MdKeyboardArrowDown } from "react-icons/md";

const CalendarIcon = () => <MdCalendarToday size={40} color="#4767A9" />;

const ArrowDown = ({ open }: { open: boolean }) => (
  <MdKeyboardArrowDown
    size={24}
    color="#233876"
    style={{
      transform: open ? "rotate(180deg)" : "none",
      transition: "transform 0.2s",
    }}
  />
);

const formatDate = (date: Date) => date.toDateString();

const formatInputDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

type AppointmentHeaderProps = {
  selectedDate: Date;
  selectedLabel: string;
  setSelectedDateAndLabel: (date: Date, label: string) => void;
};

const AppointmentHeader = ({
  selectedDate,
  selectedLabel,
  setSelectedDateAndLabel,
}: AppointmentHeaderProps) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const today = new Date();
  const tomorrow = new Date(Date.now() + 24 * 3600 * 1000);

  const handleSelect = (label: string, value: Date) => {
    setSelectedDateAndLabel(value, label);
    setDropdownOpen(false);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
    const picked = new Date(e.target.value);
      setSelectedDateAndLabel(picked, formatDate(picked));
      setDropdownOpen(false);
    }
  };

  return (
    <div className="flex flex-col w-full mt-0 pb-6">
      <div className="flex items-center w-full mt-4">
        <div className="w-full">
          <div className="flex items-center justify-between w-full bg-[#CAD4F6] rounded-[10px] px-8 py-2 min-h-[60px] shadow-[0_2px_0px_rgba(45,87,136,0.4)]">
            <div className="flex items-center space-x-3 relative" ref={dropdownRef}>
              <button
                className="flex items-center focus:outline-none p-0 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <CalendarIcon />
                <div className="flex flex-col items-start ml-2">
                  <span className="font-bold text-[#222] text-lg">{selectedLabel}</span>
                  <span className="text-[#222] text-base">{formatDate(selectedDate)}</span>
                </div>
                <span className="ml-2 flex items-center">
                  <ArrowDown open={dropdownOpen} />
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-12 left-0 bg-white rounded shadow border border-blue-100 z-10 min-w-[220px] p-2 flex flex-col gap-2">
                  <button
                    className="py-2 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left"
                    onClick={() => handleSelect("Today", today)}
                  >
                    Today <span className="ml-2 text-xs text-gray-500">{formatDate(today)}</span>
                  </button>
                  <button
                    className="py-2 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left"
                    onClick={() => handleSelect("Tomorrow", tomorrow)}
                  >
                    Tomorrow <span className="ml-2 text-xs text-gray-500">{formatDate(tomorrow)}</span>
                  </button>
                  <div className="flex flex-col px-4 pb-2">
                    <label className="text-[#233876] text-sm mb-1">Pick a date:</label>
                    <input
                      type="date"
                      className="border border-[#233876] rounded px-2 py-1"
                      value={formatInputDate(selectedDate)}
                      onChange={handleDateChange}
                    />
                  </div>
                </div>
              )}
            </div>
            <span className="font-bold text-[#233876] text-lg">Appointments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentHeader;
