"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { HiHome, HiCalendar, HiDocumentText, HiLogout } from "react-icons/hi";
import { usePathname,useRouter } from "next/navigation";

const navLinks = [
  {id:1, name: "Dashboard", href: "/dashboard", icon: HiHome, className: "mt-30 mb-3 pt-2" },
  {id:2, name: "Appointment", href: "/appointment", icon: HiCalendar, className: "mb-3 pt-2" },
  {id:3,name: "Services", href: "/services", icon: HiDocumentText, className: "mb-3 pt-2" },
];
const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  
  const activeLink = (href: string) =>
    href === "/dashboard"
      ? pathname === "/" || pathname === "/dashboard"
      : pathname === href;

  const handleLogout = () => {
    router.push('/login');
  };

  return (
    <div className="bg-[#001F54] w-80 h-screen flex flex-col">
      <div className="flex-shrink-0 flex justify-center items-center pt-15 pb-5">
        <Image
          src="/images/halicare-logo.png"
          alt="Halicare logo"
          width={100}
          height={100}
        />
      </div>
      <nav className="flex-1">
        <ul className="px-5">
          {navLinks.map((link) => (
            <li key={link.id} className={link.className}>
              <Link
                href={link.href}
                className={`flex items-center p-3 rounded-lg text-white text-lg transition-colors ${
                  activeLink(link.href) ? "bg-[#597DD8]" : "hover:bg-[#032b70]"
                }`}
              >
                <link.icon className="w-5 h-5 mr-3" />
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="flex-shrink-0 px-5 pb-8 mt-auto">
        <button 
        onClick={handleLogout}
        className="flex items-center p-3 text-white text-lg hover:bg-red-600 rounded-lg w-full transition-colors">
          <HiLogout className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;