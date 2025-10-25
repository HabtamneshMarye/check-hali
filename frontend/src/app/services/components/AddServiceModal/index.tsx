'use client';
import { useState } from 'react';
import { addService } from '../../../utils/fetchServices';

type Props = {
  centerId: string;
  onClose: () => void;
  onAdd: (newService: any) => void;
};

const AddServiceModal = ({ centerId, onClose, onAdd }: Props) => {
  const [name, setName] = useState('');
  const [status, setStatus] = useState('Available');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const newServiceData = {
        service_name: name,
        status,
        description,
        center_id: centerId,
      };

      const addedService = await addService(newServiceData);
      onAdd(addedService);
      onClose();
    } catch (error) {
        setError('Failed to add service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br bg-black/50 z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#172A5A]">Add New Service</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#172A5A] cursor-pointer text-white flex items-center
           justify-center hover:bg-blue-700 text-lg"
              aria-label="Close modal"> &times; </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Service Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2
           focus:ring-[#172A5A]" required />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2
           focus:ring-[#172A5A]">
              <option value="Available">Available</option>
              <option value="Not Available">Not Available</option>
            </select>

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2
           focus:ring-[#172A5A] h-24"/>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#172A5A] text-white py-2 rounded font-bold
           hover:bg-[#10004B] disabled:opacity-70 cursor-pointer">
              {isLoading ? 'Adding...' : 'Add Service'}
            </button>
          </form>
        </div>
      </div>
    );
  }

export default AddServiceModal;
