'use client';

interface SearchBarProps {
 searchTerm: string;
 onSearchChange: (term: string) => void;
}

function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
 return (
   <input
     type="text"
     placeholder="Search by service name"
     className="p-2 mt-5 mb-5 border-1 border-[#172A5A] rounded w-150 focus:outline-none focus:ring-1
      focus:ring-[#172A5A] font-albert-sans"
     value={searchTerm}
     onChange={(e) => onSearchChange(e.target.value)}/>
 );
}

export default SearchBar;
