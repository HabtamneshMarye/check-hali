import React from "react";
interface TabProps {
  label: string;
  count: number;
  active?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}
function Tab({ label, count, active = false, onClick, disabled = false }: TabProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex flex-col items-center justify-center flex-1 min-w-0 py-3
        ${active
            ? "bg-[#10004B] text-white"
            : disabled
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "bg-[#9EABC1] text-white"}
        rounded-t-[12px] focus:outline-none transition-all`}
      style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }} type="button" >
      <span className="text-lg font-bold leading-none">{count}</span>
      <span className="text-xs mt-1 font-normal">{label}</span>
    </button>
  );
}
export default Tab;