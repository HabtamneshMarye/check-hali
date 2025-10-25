'use client';

import { useState, useEffect } from 'react';
import useFetchServices from '../hooks/useFetchServices';
import useFetchClinics, { Clinic } from '../hooks/useFetchClinics';
import { updateClinic } from '../utils/fetchClinics';
import AddServiceModal from './components/AddServiceModal';
import UpdateServiceModal from './components/UpdateServiceModal';
import { deleteService } from '../utils/fetchServices';
import SearchBar from './components/SearchBar';
import ServicesTable from './components/ServiceTable';
import EditContact from './components/EditContactModal';
import Layout from '../shared-components/Layout';
import { useArv } from '../hooks/useArv';

const format24ToTimeInput = (time24: string | null | undefined): string => {
  if (!time24) return '08:00';
  const parts = time24.split(':');
  if (parts.length >= 2) {
    return `${parts[0]}:${parts[1]}`;
  }
  return '08:00';
};

const formatTimeInputTo24 = (timeInput: string): string => {
  if (!timeInput) return '08:00:00';
  return `${timeInput}:00`;
};

const ServicesPage = () => {
  const { services, loading: servicesLoading, error: servicesError, setServices } = useFetchServices();
  const { clinics, loading: clinicsLoading, error: clinicsError, refetch: refetchClinics } = useFetchClinics();

  const clinic = clinics.length > 0 ? clinics[0] : null;
  const {
    arvStatus,
    setArvStatus,
    loading: arvLoading,
    error: arvError,
    saveArvStatus
  } = useArv(clinic?.center_id || null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [openingTime, setOpeningTime] = useState('08:00');
  const [closingTime, setClosingTime] = useState('20:00');
  const [clinicStatus, setClinicStatus] = useState<'Open' | 'Closed'>('Open');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (clinic && clinic.opening_time && clinic.closing_time) {
      setOpeningTime(format24ToTimeInput(clinic.opening_time));
      setClosingTime(format24ToTimeInput(clinic.closing_time));
      setClinicStatus(clinic.operational_status === 'Open' ? 'Open' : 'Closed');
    }
  }, [clinic]);

  const handleContactUpdate = async (updatedData: { telephone: string; location: string }) => {
    if (!clinic) return;

    try {
      setIsSaving(true);
      const payload = {
        center_name: clinic.center_name,
        center_type: clinic.center_type,
        address: updatedData.location,
        contact_number: updatedData.telephone,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        opening_time: formatTimeInputTo24(openingTime),
        closing_time: formatTimeInputTo24(closingTime),
        operational_status: clinicStatus,
      };

      await updateClinic(clinic.center_id, payload);
      await refetchClinics();

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      const message = (err as Error).message || 'Failed to update contact details.';
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveClinicSettings = async () => {
    if (!clinic) return;
    try {
      setIsSaving(true);
      await updateClinic(clinic.center_id, {
        center_name: clinic.center_name,
        center_type: clinic.center_type,
        address: clinic.address,
        contact_number: clinic.contact_number,
        latitude: clinic.latitude,
        longitude: clinic.longitude,
        opening_time: formatTimeInputTo24(openingTime),
        closing_time: formatTimeInputTo24(closingTime),
        operational_status: clinicStatus,
      });

      await saveArvStatus(arvStatus);
      await refetchClinics();
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      if (!arvError) {
        const message = (err as Error).message || 'Failed to save clinic settings';
        setError(message);
        setTimeout(() => setError(null), 3000);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleAdd = async (newService: any) => {
    try {
      setServices((prevServices) => [newService, ...prevServices]);
      setShowAddModal(false);
    } catch (err) {
      const message = (err as Error).message || 'Failed to add service. Please try again.';
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdate = async (updatedService: any) => {
    try {
      setServices((prevServices) =>
        prevServices.map((service) =>
          service.service_id === updatedService.service_id ? updatedService : service
        )
      );
      setShowUpdateModal(false);
      setSelectedServiceId(null);
    } catch (err) {
      const message = (err as Error).message || 'Failed to update service. Please try again.';
      setError(message);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setServiceToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete) {
      try {
        await deleteService(serviceToDelete);
        setServices((prevServices) =>
          prevServices.filter((service) => service.service_id !== serviceToDelete)
        );
      } catch (err) {
        const message = (err as Error).message || 'Failed to delete service. Please try again.';
        setError(message);
        setTimeout(() => setError(null), 3000);
      }
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const filteredServices = services.filter((service) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (service.service_name?.toLowerCase() || '').includes(term);
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentServices = filteredServices.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getServiceForUpdate = () => {
    if (!selectedServiceId) return null;
    return services.find((service) => service.service_id === selectedServiceId) || null;
  };

  const serviceToUpdate = getServiceForUpdate();

  useEffect(() => {
    if (showUpdateModal && selectedServiceId && !serviceToUpdate) {
      setShowUpdateModal(false);
      setSelectedServiceId(null);
    }
  }, [showUpdateModal, selectedServiceId, serviceToUpdate]);

  const isLoading = servicesLoading || clinicsLoading || arvLoading || isSaving;
  const combinedError = servicesError || clinicsError || error || arvError;
  const isErrorState = !!combinedError;

  if (isLoading && services.length === 0 && clinics.length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[500px] text-lg text-[#172A5A] font-medium">
          Loading clinic and services data...
        </div>
      </Layout>
    );
  }

  if (isErrorState) {
    return (
      <Layout>
        <div className="p-6 text-red-600 font-medium">
          Error: {combinedError}
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto h-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-4 sm:space-y-0">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          <EditContact
            initialData={{
              telephone: clinic?.contact_number || '',
              location: clinic?.address || '',
            }}
            onSave={handleContactUpdate}
          />
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <div className="bg-blue-200 p-4 mb-5 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
            <label className="block text-lg font-bold text-[#172A5A] mb-2">Opening Hours</label>
            <input
              type="time"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
              focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                appearance: 'none',
              }}
            />
          </div>

          <div className="bg-blue-200 p-4 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
            <label className="block text-lg font-bold text-[#172A5A] mb-2">Closing Hours</label>
            <input
              type="time"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
              focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'textfield',
                appearance: 'none',
              }}
            />
          </div>

          <div className="bg-blue-200 p-4 rounded-xl flex-1 min-w-[200px] flex flex-col" style={{ height: '140px' }}>
            <label className="block text-lg font-bold text-[#172A5A] mb-2">ARV Medication Status</label>
            <select
              value={arvStatus}
              onChange={(e) => setArvStatus(e.target.value as 'Available' | 'Not Available')}
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
              onChange={(e) => setClinicStatus(e.target.value as 'Open' | 'Closed')}
              className="w-full p-3 border-4 rounded-lg bg-[#172A5A] text-white border-[#172A5A] text-sm
              focus:outline-none focus:ring-2 focus:ring-[#172A5A] mt-auto cursor-pointer">
              <option value="Open">Open</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <button
            onClick={handleSaveClinicSettings}
            disabled={isLoading}
            className={`px-4 py-2 rounded transition font-medium ${isLoading
                ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                : 'bg-[#B6D4F4] text-[#172A5A] hover:bg-[#a0c4e8] cursor-pointer'
              }`}>
            {isSaving ? 'Saving...' : 'Save Clinic Settings'}
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          disabled={isLoading}
          className={`px-4 sm:px-7 py-2 sm:py-3 rounded transition text-sm sm:text-base font-bold mt-[-12px] mb-3 w-full sm:w-auto cursor-pointer ${isLoading
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : 'bg-[#172A5A] text-white hover:bg-[#10004B]'
            }`}>
          Add Services
        </button>

        <div className="responsive-table-container">
          <ServicesTable
            services={currentServices}
            onEdit={(id) => {
              setSelectedServiceId(id);
              setShowUpdateModal(true);
            }}
            onDelete={handleDelete}
          />
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className={`bg-white text-[#172A5A] border-2 border-[#172A5A] rounded px-4 sm:px-5 py-2 font-bold text-sm hover:bg-[#F3F6F9] transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer ${currentPage === 1 || isLoading ? 'bg-gray-100' : ''
                }`}>
              Previous
            </button>

            <div className="text-[#172A5A] font-bold text-sm sm:text-lg">
              Page {currentPage} of {totalPages}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className={`text-white rounded px-4 sm:px-6 py-2 font-bold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto cursor-pointer ${currentPage === totalPages || isLoading ? 'bg-gray-400' : 'bg-[#172A5A] hover:bg-[#10004B]'
                }`} >
              Next
            </button>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md border-2 border-green-400">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-800">Success!</p>
                  <p className="text-sm text-gray-800">Settings updated successfully!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {isErrorState && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50 p-4">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md border-2 border-red-400">
              <p className="text-red-600 font-medium">{combinedError}</p>
            </div>
          </div>
        )}
      </div>

      {showAddModal && clinic?.center_id && (
        <AddServiceModal
          centerId={clinic.center_id}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAdd} />
      )}

      {showUpdateModal && serviceToUpdate && (
        <UpdateServiceModal
          service={serviceToUpdate}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedServiceId(null);
          }}
          onUpdate={handleUpdate} />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold text-[#172A5A] mb-4">Confirm Deletion</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this service?</p>
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition font-bold w-full sm:w-auto cursor-pointer"> Cancel </button>
              <button
                onClick={confirmDelete}
                className="bg-[#172A5A] text-white px-4 py-2 rounded hover:bg-[#10004B] transition font-bold w-full sm:w-auto cursor-pointer" > Confirm </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ServicesPage;