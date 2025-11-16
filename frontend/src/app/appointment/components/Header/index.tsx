"use client";
import React, { useState, useRef, useEffect, useMemo } from "react";
import { MdCalendarToday, MdKeyboardArrowDown } from "react-icons/md";
const CalendarIcon = () => <MdCalendarToday size={40} color="#4767A9" />;
const ArrowDown = ({ open }: { open: boolean }) => (
 <MdKeyboardArrowDown
   size={24}
   color="#233876"
   style={{
     transform: open ? "rotate(180deg)" : "none",
     transition: "transform 0.2s",
   }}/>
);
const formatDate = (date: Date) => date.toDateString();


const formatInputDate = (date: Date) => {
 const d = new Date(date);
 const y = d.getFullYear();
 const m = String(d.getMonth() + 1).padStart(2, "0");
 const day = String(d.getDate()).padStart(2, "0");
 return `${y}-${m}-${day}`;
};


const startOfDay = (date: Date) => {
 const d = new Date(date);
 d.setHours(0, 0, 0, 0);
 return d;
};


const endOfDay = (date: Date) => {
 const d = new Date(date);
 d.setHours(23, 59, 59, 999);
 return d;
};


const getThisWeekRange = (today: Date) => {
 const d = startOfDay(today);
 const day = (d.getDay() + 6) % 7;
 const start = new Date(d);
 start.setDate(d.getDate() - day);
 const end = new Date(start);
 end.setDate(start.getDate() + 6);
 return { start: startOfDay(start), end: endOfDay(end) };
};


const getThisMonthRange = (today: Date) => {
 const d = startOfDay(today);
 const start = new Date(d.getFullYear(), d.getMonth(), 1);
 const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
 return { start: startOfDay(start), end: endOfDay(end) };
};


const formatRangeLabel = (start: Date, end: Date, label: string) => {
   if (label !== 'Custom Range') return label;
   if (formatDate(start) === formatDate(end)) return formatDate(start);
   return `${formatDate(start)} - ${formatDate(end)}`;
}


type DateRange = {
 start: Date;
 end: Date;
};
type AppointmentHeaderProps = {
 selectedRange: DateRange;
 selectedLabel: string;
 setSelectedRangeAndLabel: (range: DateRange, label: string) => void;
};
const AppointmentHeader = ({
 selectedRange,
 selectedLabel,
 setSelectedRangeAndLabel,
}: AppointmentHeaderProps) => {
 const [dropdownOpen, setDropdownOpen] = useState(false);
 const dropdownRef = useRef<HTMLDivElement>(null);
  const [customStart, setCustomStart] = useState(selectedRange.start);
 const [customEnd, setCustomEnd] = useState(selectedRange.end);
 const [customRangeError, setCustomRangeError] = useState("");
 useEffect(() => {


   if(dropdownOpen) {
       setCustomStart(selectedRange.start);
       setCustomEnd(selectedRange.end);
   }
   function handleClickOutside(event: MouseEvent) {
     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
       setDropdownOpen(false);
       setCustomRangeError("");
     }
   }
   if (dropdownOpen) document.addEventListener("mousedown", handleClickOutside);
   return () => document.removeEventListener("mousedown", handleClickOutside);
 }, [dropdownOpen, selectedRange.start, selectedRange.end]);
 const today = useMemo(() => new Date(), []);
 const tomorrow = useMemo(() => new Date(Date.now() + 24 * 3600 * 1000), []);
 const thisWeekRange = useMemo(() => getThisWeekRange(today), [today]);
 const thisMonthRange = useMemo(() => getThisMonthRange(today), [today]);
 const handleSelectRange = (label: string, start: Date, end: Date) => {
   setSelectedRangeAndLabel({ start: startOfDay(start), end: endOfDay(end) }, label);
   setDropdownOpen(false);
   setCustomRangeError("");
 };
 const handleApplyCustomRange = () => {
   if (customStart.getTime() > customEnd.getTime()) {
     setCustomRangeError("Start date cannot be after end date.");
     return;
   }
   setCustomRangeError("");
   handleSelectRange("Custom Range", customStart, customEnd);
 };
 const handleCustomStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const newStart = e.target.value ? new Date(e.target.value) : customStart;
   setCustomStart(newStart);
   if (newStart.getTime() > customEnd.getTime()) {
       setCustomRangeError("Start date cannot be after end date.");
   } else {
       setCustomRangeError("");
   }
 };
 const handleCustomEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const newEnd = e.target.value ? new Date(e.target.value) : customEnd;
   setCustomEnd(newEnd);
   if (customStart.getTime() > newEnd.getTime()) {
       setCustomRangeError("Start date cannot be after end date.");
   } else {
       setCustomRangeError("");
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
               onClick={() => setDropdownOpen(!dropdownOpen)} >
               <CalendarIcon />
               <div className="flex flex-col items-start ml-2">
                 <span className="font-bold text-[#222] text-lg">{selectedLabel}</span>
                 <span className="text-[#222] text-base">
                   {formatRangeLabel(selectedRange.start, selectedRange.end, selectedLabel)}
                 </span>
               </div>
               <span className="ml-2 flex items-center">
                 <ArrowDown open={dropdownOpen} />
               </span>
             </button>
             {dropdownOpen && (
               <div className="absolute top-12 left-0 bg-white rounded shadow border border-blue-100 z-10 min-w-[280px] p-2 flex flex-col gap-1">
              
                 <div className="border-b border-gray-200 pb-1 mb-1">
                   <span className="text-[#233876] text-sm font-semibold block mb-1">Quick Select (Day)</span>
                   <button
                     className="py-1 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left w-full"
                     onClick={() => handleSelectRange("Today", today, today)}
                   >
                     Today <span className="ml-2 text-xs text-gray-500">{formatDate(today)}</span>
                   </button>
                   <button
                     className="py-1 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left w-full"
                     onClick={() => handleSelectRange("Tomorrow", tomorrow, tomorrow)}
                   >
                     Tomorrow <span className="ml-2 text-xs text-gray-500">{formatDate(tomorrow)}</span>
                   </button>
                 </div>
               
                 <div className="border-b border-gray-200 pb-1 mb-1">
                   <span className="text-[#233876] text-sm font-semibold block mb-1">Quick Select (Range)</span>
                   <button
                     className="py-1 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left w-full"
                     onClick={() => handleSelectRange("This Week", thisWeekRange.start, thisWeekRange.end)}
                   >
                     This Week <span className="ml-2 text-xs text-gray-500">({formatDate(thisWeekRange.start)} - {formatDate(thisWeekRange.end)})</span>
                   </button>
                   <button
                     className="py-1 px-4 text-[#233876] hover:bg-[#F0F4FF] rounded text-left w-full"
                     onClick={() => handleSelectRange("This Month", thisMonthRange.start, thisMonthRange.end)}
                   >
                     This Month <span className="ml-2 text-xs text-gray-500">({formatDate(thisMonthRange.start)} - {formatDate(thisMonthRange.end)})</span>
                   </button>
                 </div>
                
                 <div className="flex flex-col px-4 pt-1">
                   <label className="text-[#233876] text-sm font-semibold mb-1">Custom Range:</label>
                   <div className="flex gap-2 mb-1">
                       <input
                         type="date"
                         aria-label="Start Date"
                         title="Start Date"
                         className="border border-[#233876] rounded px-2 py-1 flex-1 text-sm"
                         value={formatInputDate(customStart)}
                         onChange={handleCustomStartChange}
                       />
                       <span className="self-center text-sm text-[#233876]">to</span>
                       <input
                         type="date"
                         aria-label="End Date"
                         title="End Date"
                         className="border border-[#233876] rounded px-2 py-1 flex-1 text-sm"
                         value={formatInputDate(customEnd)}
                         onChange={handleCustomEndChange}
                       />
                   </div>
                   {customRangeError && (
                       <p className="text-red-500 text-xs mb-1 font-medium">{customRangeError}</p>
                   )}
                   <button
                       onClick={handleApplyCustomRange}
                       disabled={!!customRangeError}
                       className={`py-1 rounded text-white font-medium transition-colors ${
                           !!customRangeError
                               ? 'bg-gray-400 cursor-not-allowed'
                               : 'bg-[#001F54] hover:bg-[#233876]'
                       }`}
                   >
                       Apply
                   </button>
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



