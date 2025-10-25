"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useLogin from "../hooks/useLogin";
import useCheckClinic from "../hooks/useCheckClinic";
import Link from "next/link";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useLogin();
  const { checkClinic } = useCheckClinic();

  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(formData);
      if (data?.token && data?.user_id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        try {
          const clinicExists = await checkClinic(data.user_id, data.token);
          router.push(clinicExists ? "/dashboard" : "/clinic_registration");
        } catch {
        }
      }
    } catch {
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-[#DBEAFE] min-h-screen">
      <div className="w-full md:w-1/2 h-60 md:h-screen relative">
        <Image
          src="/image/Doctor.png"
          alt="Doctor"
          fill
          className="object-cover rounded-t-lg md:rounded-l-lg"
          priority
        />
      </div>
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-[#CBD5E1] p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-12 rounded-md bg-[#CBD5E1]"
        >
          <h2 className="text-3xl font-bold text-center text-[#001F54] mb-8">
            Login
          </h2>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-[#001F54]">
              Phone Number
            </label>
            <input
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Phone number"
              required
              className="w-full px-6 py-4 rounded-2xl border border-[#001F54] bg-blue-50 text-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
          </div>
          <div className="mb-10 relative">
            <label className="block font-semibold mb-2 text-[#001F54]">
              Password
            </label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-6 py-4 rounded-2xl border border-[#001F54] bg-blue-50 text-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-6 top-15 -translate-y-1/2 text-[#001F54] text-xl"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>
          {error && <div className="mb-4 text-center text-red-600">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-2xl bg-[#001F54] text-white text-xl font-bold hover:bg-[#001A4A] transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
          <div className="text-center mt-5 text-[#001F54]">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold underline">
              Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
