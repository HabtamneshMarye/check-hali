"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useRegisterClinic from "../hooks/useRegisterClinic";
function ClinicForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clinicName: "",
    contact: "",
    address: "",
    clinicImage: null as File | null,
    openingTime: "08:00",
    closingTime: "20:00",
  });
  const [successMessage, setSuccessMessage] = useState<string | false>();
  const { registerClinic, loading, error } = useRegisterClinic();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "clinicImage" && files) {
      setFormData((prev) => ({ ...prev, clinicImage: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = localStorage.getItem('user_id');

    if (!userId) { 
        console.error("User ID missing in localStorage. Cannot register clinic.");
        alert("Error: Please log in again. Missing user details.");
        return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append("center_name", formData.clinicName);
    formDataToSend.append("center_type", "clinic");
    formDataToSend.append("address", formData.address);
    formDataToSend.append("contact_number", formData.contact);
    formDataToSend.append("operational_status", "Open");
    formDataToSend.append("opening_time", formData.openingTime);
    formDataToSend.append("closing_time", formData.closingTime);
    if (formData.clinicImage) {
      formDataToSend.append("image_path", formData.clinicImage);
    }
    formDataToSend.append("user", userId);
    const result = await registerClinic(formDataToSend);
    if (result) {
      setSuccessMessage("Clinic registered successfully");
      setTimeout(() => {
        setSuccessMessage(false);
        router.push("/dashboard");
      }, 1500);
    }
  };
  return (
    <div className="min-h-screen bg-[#001355] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-5xl h-170 flex overflow-hidden">
        <div className="w-1/2 relative bg-white border-4 border-white rounded-l-lg overflow-hidden">
          <Image src="/images/registrationImage.png" alt="Registration Image" fill className="object-cover" />
          <div className="absolute top-0 bottom-0 left-0 right-0 flex flex-col justify-center text-center">
            <h2 className="text-4xl font-bold mb-6 text-white">Welcome to HaliCare </h2>
            <p className="text-white text-xl text-center">{" "} To proceed please fill in the <br /> details of your clinic </p>
          </div>
        </div>
        <form className="w-1/2 p-10 flex flex-col gap-5 text-[#001355] bg-white" onSubmit={handleSubmit} >
          <label className="font-semibold text-sm">Clinic Name</label>
          <input name="clinicName" type="text" required value={formData.clinicName} onChange={handleChange} className="border border-[#001355] rounded-md p-2 text-sm" />
          <label className="font-semibold text-sm"> Contact Number</label>
          <input name="contact" type="text" required value={formData.contact} onChange={handleChange} className="border border-[#001355] rounded-md p-2 text-sm" />
          <label className="font-semibold text-sm"> Address</label>
          <input name="address" type="text" required value={formData.address} onChange={handleChange} className="border border-[#001355] rounded-md p-2 text-sm" />
          <label className="font-semibold text-sm"> Clinic Image </label>
          <input
            name="clinicImage" type="file" accept="image/*" onChange={handleChange} className="border border-[#001355] rounded-md p-2 text-sm cursor-pointer" />
          <div className="flex gap-4">
            <div className="grid gap-3">
              <label className="font-semibold text-sm">Opening Time</label>
              <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange}  className="border border-[#001355] rounded-md p-2 text-sm cursor-pointer" />
            </div>
            <div className="grid gap-3">
              <label className="font-semibold text-sm">Closing Time</label>
              <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange}  className="border border-[#001355] rounded-md p-2 text-sm cursor-pointer" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="mt-3 bg-[#001355] text-white w-105 font-semibold py-3 rounded-md hover:bg-[#003399] cursor-pointer"  >
            {loading ? "Saving..." : "Save"}
          </button>
          {successMessage && (
            <p className="text-green-800 font-semibold mt-2">{successMessage}</p>
          )}
          {error && <p className="text-red-700 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
}
export default ClinicForm;