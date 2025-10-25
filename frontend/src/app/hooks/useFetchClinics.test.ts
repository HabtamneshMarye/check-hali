import { renderHook, waitFor } from '@testing-library/react';
import useFetchClinics from './useFetchClinics';
import { fetchClinics } from '../utils/fetchClinics';

jest.mock('../utils/fetchClinics');

const mockClinics = [
  {
    center_id: '1',
    center_name: 'Melkezedik',
    center_type: 'Hospital',
    image_path: '/images/Melkezedik.jpg',
    address: 'Korongo',
    latitude: 40.7128,
    longitude: -74.0060,
    contact_number: '555-0123',
    operational_status: 'open',
    updated_at: '2025-09-22T10:00:00Z',
    operating_hours: '9AM-5PM',
  },
  {
    center_id: '2',
    center_name: 'Akala',
    center_type: 'Urgent Care',
    image_path: null,
    address: 'Nairobi',
    latitude: 34.0522,
    longitude: -118.2437,
    contact_number: '555-0124',
    operational_status: 'closed',
    updated_at: '2025-09-22T12:00:00Z',
    operating_hours: '10AM-6PM',
  },
];

describe('useFetchClinics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true and no clinics or error', () => {
    (fetchClinics as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetchClinics());

    expect(result.current.loading).toBe(true);
    expect(result.current.clinics).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch clinics successfully', async () => {
    (fetchClinics as jest.Mock).mockResolvedValue(mockClinics);
    const { result } = renderHook(() => useFetchClinics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.clinics).toEqual(mockClinics);
    expect(result.current.error).toBe(null);
    expect(fetchClinics).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch clinics';
    (fetchClinics as jest.Mock).mockRejectedValue(new Error(errorMessage));
    const { result } = renderHook(() => useFetchClinics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.clinics).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(fetchClinics).toHaveBeenCalledTimes(1);
  });
});