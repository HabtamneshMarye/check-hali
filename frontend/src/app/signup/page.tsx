"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useRegister from "../hooks/useRegister";
import Link from "next/link";
import Image from "next/image";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignUpPage() {
  const router = useRouter();
  const { register, loading, error } = useRegister();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    password: "",
    password_confirmation: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirm: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };

      if (name === "password_confirmation" || name === "password") {
        if (
          updated.password &&
          updated.password_confirmation &&
          updated.password !== updated.password_confirmation
        ) {
          setFormError("Passwords do not match.");
        } else {
          setFormError(null);
        }
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { first_name, last_name, phone_number, password, password_confirmation } = formData;

    if (password !== password_confirmation) {
      setFormError("Passwords do not match.");
      return;
    }

    const result = await register({
      first_name,
      last_name,
      phone_number,
      password,
      user_type: "CLINICIAN",
    });

    if (result) {
      router.push("/login");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#DBEAFE]">
      <div className="w-full md:w-1/2 min-h-screen relative">
        <Image
          src="/image/Doctor.png"
          alt="Doctor"
          fill
          className="object-cover rounded-t-lg md:rounded-l-lg"
          priority
        />
      </div>
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-[#CBD5E1] p-10 md:p-16 md:pl-20 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-3xl font-bold text-center text-[#001F54] mb-8">
            Sign Up
          </h2>

          {[
            { label: "First Name", name: "first_name", placeholder: "Enter first name" },
            { label: "Last Name", name: "last_name", placeholder: "Enter last name" },
            { label: "Phone Number", name: "phone_number", placeholder: "Phone number" },
          ].map(({ label, name, placeholder }) => (
            <div key={name} className="mb-4">
              <label className="block font-semibold mb-2 text-[#001F54]">{label}</label>
              <input
                name={name}
                value={formData[name as keyof typeof formData]}
                onChange={handleChange}
                placeholder={placeholder}
                required
                className="w-full px-6 py-3 rounded-2xl border border-[#001F54] bg-blue-50 text-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#001F54]"
              />
            </div>
          ))}

      
          <div className="mb-4 relative">
            <label className="block font-semibold mb-2 text-[#001F54]">Password</label>
            <input
              name="password"
              type={showPassword.password ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-6 py-3 rounded-2xl border border-[#001F54] bg-blue-50 text-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#001F54]"
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, password: !prev.password }))
              }
              className="absolute right-6 top-14 -translate-y-1/2 text-[#001F54] text-xl"
              tabIndex={-1}
              aria-label={showPassword.password ? "Hide password" : "Show password"}
            >
              {showPassword.password ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

         
          <div className="mb-2 relative">
            <label className="block font-semibold mb-2 text-[#001F54]">Confirm Password</label>
            <input
              name="password_confirmation"
              type={showPassword.confirm ? "text" : "password"}
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
              className={`w-full px-6 py-3 rounded-2xl border ${
                formError ? "border-red-600" : "border-[#001F54]"
              } bg-blue-50 text-[#001F54] focus:outline-none focus:ring-2 focus:ring-[#001F54]`}
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))
              }
              className="absolute right-6 top-14 -translate-y-1/2 text-[#001F54] text-xl"
              tabIndex={-1}
              aria-label={showPassword.confirm ? "Hide confirm password" : "Show confirm password"}
            >
              {showPassword.confirm ? <FiEye /> : <FiEyeOff />}
            </button>
          </div>

          
          {formError && (
            <p className="text-red-600 text-sm mb-4">{formError}</p>
          )}

          {error && (
            <div className="mb-4 text-center text-red-600" >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-2xl bg-[#001F54] text-white text-lg font-bold hover:bg-[#001a4a] transition cursor-pointer mt-6" 
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <div className="text-center mt-5 text-[#001F54]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}