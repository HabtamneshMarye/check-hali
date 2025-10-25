'use client';
import { useState } from 'react';
import { updateService } from '../../../utils/fetchServices';

interface Service {
 service_id: string;
 service_name: string;
 status: string;
 description: string;
}

interface Props {
 service: Service;
 onClose: () => void;
 onUpdate: (updatedService: any) => void;
}

const UpdateServiceModal = ({ service, onClose, onUpdate }: Props) => {
 const [serviceName, setServiceName] = useState(service.service_name);
 const [status, setStatus] = useState(service.status);
 const [description, setDescription] = useState(service.description);
 const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setLoading(true);
   try {
     const updatedData = {
       service_name: serviceName,
       status,
       description,
     };
    
     const updatedService = await updateService(service.service_id, updatedData);
     onUpdate(updatedService);
     onClose();
   } catch (error) {
     const message = (error as Error).message || 'Failed to update service. Please try again.';
     setError(message);
     setTimeout(() => setError(null), 3000);
   } finally {
     setLoading(false);
   }
 };

 return (
   <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br bg-black/50 z-50 p-4 cursor-pointer">
     <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl mx-auto">
       <div className="flex justify-between items-center mb-6">
         <h2 className="text-2xl font-bold text-[#172A5A] ">Update Service</h2>
         <button
           onClick={onClose}
           className="w-10 h-10 rounded-full bg-[#172A5A] cursor-pointer text-white flex items-center
           justify-center hover:bg-blue-700 focus:outline-none transition-all shadow-md hover:shadow-lg text-xl font-bold"
           aria-label="Close modal"> &times; </button>
       </div>

       <form onSubmit={handleSubmit} className="space-y-5">
         <div>
           <input
             type="text"
             placeholder="Service Name"
             value={serviceName}
             onChange={(e) => setServiceName(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-[#172A5A] text-base"
             required/>
         </div>

         <div>
           <select
             value={status}
             onChange={(e) => setStatus(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
              focus:ring-[#172A5A] text-base" >
             <option value="Available">Available</option>
             <option value="Not Available">Not Available</option>
           </select>
         </div>

         <div>
           <textarea
             placeholder="Description"
             value={description}
             onChange={(e) => setDescription(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-[#172A5A] h-32 resize-none text-base"
             rows={4}/>
         </div>

         <button
           type="submit"
           disabled={loading}
           className="w-full bg-[#172A5A] cursor-pointer text-white py-3 font-bold rounded-lg
           hover:bg-[#10004B] transition disabled:opacity-70 disabled:cursor-not-allowed text-base">
           {loading ? 'Updating...' : 'Update Service'}
         </button>
       </form>
     </div>
   </div>
 );
};

export default UpdateServiceModal;