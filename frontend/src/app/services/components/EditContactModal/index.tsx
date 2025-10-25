'use client';
import { useState, useEffect } from 'react';

interface ContactDetails {
  telephone: string;
  location: string;
}

const Contact: ContactDetails = {
  telephone: '',
  location: '',
};

interface EditContactProps {
  initialData?: ContactDetails;
  onSave: (updatedData: ContactDetails) => Promise<void>; 
}

const EditContact = ({ initialData = Contact, onSave }: EditContactProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactDetails>(initialData); 
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);


  useEffect(() => {
    if (isEditing) {
      document.body.style.overflow = 'hidden';
      setFormData(initialData); 
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isEditing, initialData]);


  const openEditModal = () => {
    setIsEditing(true);
    setIsSaving(false);
  };

  const closeEditModal = () => {
    setIsEditing(false);
    setIsSaving(false);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    
    try {
        await onSave(formData); 
        setIsEditing(false);
    } catch (error) {
      
    } finally {
        setIsSaving(false);
    }
  };

  return (
    <div>
      <button
        onClick={openEditModal}
        className="bg-[#172A5A] text-white px-7 py-3 rounded hover:bg-gray-700 transition text-sm font-medium cursor-pointer ml-"> Edit Contact </button>

      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-40 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-[#172A5A]">Edit Contact Details</h2>
          <button
            onClick={closeEditModal}
            className="w-8 h-8 rounded-full bg-[#172A5A] text-white flex items-center justify-center hover:bg-blue-700 text-lg cursor-pointer"
            aria-label="Close modal"> &times; </button></div>

          <form
              onSubmit={(e) => {
                e.preventDefault();
                saveChanges();
              }}
              className="space-y-4">

          <input
              type="text"
              placeholder="Telephone"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#172A5A]"
              disabled={isSaving}/>

          <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#172A5A]"
              disabled={isSaving}/>

          <button
              type="submit"
              className="w-full bg-[#172A5A] text-white py-2 rounded font-bold hover:bg-[#10004B] transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditContact;
