'use client';

interface CardsProps {
 openingHours: string;
 closingHours: string;
 arvStatus: 'Available' | 'Not Available';
 clinicStatus: 'Open' | 'Closed';
 onOpeningHoursChange: (value: string) => void;
 onClosingHoursChange: (value: string) => void;
 onArvStatusChange: (value: 'Available' | 'Not Available') => void;
 onClinicStatusChange: (value: 'Open' | 'Closed') => void;
}

const generateHourOptions = () => {
 const hours = [];
 for (let i = 0; i < 13; i++) {
   const hour24 = 8 + i; 
   const hour12 = hour24 % 12 || 12;
   const period = hour24 < 12 ? 'AM' : 'PM';
   const displayHour = hour12.toString().padStart(2, '0');
   const time = `${displayHour}:00 ${period}`;
   hours.push(<option key={i} value={time}>{time}</option>);
 }
 return hours;
};

const Cards = ({
 openingHours,
 closingHours,
 arvStatus,
 clinicStatus,
 onOpeningHoursChange,
 onClosingHoursChange,
 onArvStatusChange,
 onClinicStatusChange,
}: CardsProps) => {
 return (
   <div className="flex flex-wrap gap-4 mb-6">
     <div className="bg-blue-200 p-4 mb-5 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
       <label className="block text-lg font-bold text-[#172A5A] mb-2">Opening Hours</label>
       <select
         value={openingHours}
         onChange={(e) => onOpeningHoursChange(e.target.value)}
         className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
         focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer">
         {generateHourOptions()}
       </select>
     </div>

     <div className="bg-blue-200 p-4 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
       <label className="block text-lg font-bold text-[#172A5A] mb-2">Closing Hours</label>
       <select
         value={closingHours}
         onChange={(e) => onClosingHoursChange(e.target.value)}
         className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
         focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer">
         {generateHourOptions()}
       </select>
     </div>

     <div className="bg-blue-200 p-4 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
       <label className="block text-lg font-bold text-[#172A5A] mb-2">ARV Medication Status</label>
       <select
         value={arvStatus}
         onChange={(e) => onArvStatusChange(e.target.value as 'Available' | 'Not Available')}
         className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
         focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer">
         <option value="Available">Available</option>
         <option value="Not Available">Not Available</option>
       </select>
     </div>

     <div className="bg-blue-200 p-4 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
       <label className="block text-lg font-bold text-[#172A5A] mb-2">Clinic Operational Status</label>
       <select
         value={clinicStatus}
         onChange={(e) => onClinicStatusChange(e.target.value as 'Open' | 'Closed')}
         className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
         focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer">
         <option value="Open">Open</option>
         <option value="Closed">Closed</option>
       </select>
     </div>
   </div>
 );
};

export default Cards;