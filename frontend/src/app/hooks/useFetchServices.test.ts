import { renderHook, act, waitFor } from '@testing-library/react';
import useFetchServices from './useFetchServices';
import { fetchServices } from '../utils/fetchServices';

jest.mock('../utils/fetchServices');

const mockServices = [
  {
    service_id: '1',
    service_name: 'Arv Refills',
    status: 'active',
    description: 'For HIV patients to get Arv',
    center_id: 'center-clinic',
  },
  {
    service_id: '2',
    service_name: 'Hiv',
    status: 'inactive',
    description: 'For HIV patients',
    center_id: 'center-clinic',
  },
];

describe('useFetchServices', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with loading true and no services or error', () => {
   
    (fetchServices as jest.Mock).mockImplementation(() => new Promise(() => {}));
    
    const { result } = renderHook(() => useFetchServices());

    expect(result.current.loading).toBe(true);
    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('should fetch services successfully', async () => {
    (fetchServices as jest.Mock).mockResolvedValue(mockServices);

    const { result } = renderHook(() => useFetchServices());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.services).toEqual(mockServices);
    expect(result.current.error).toBe(null);
    expect(fetchServices).toHaveBeenCalledTimes(1);
  });

  it('should handle fetch error', async () => {
    const errorMessage = 'Failed to fetch services';
    (fetchServices as jest.Mock).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFetchServices());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(result.current.services).toEqual([]);
    expect(result.current.error).toBe(errorMessage);
    expect(fetchServices).toHaveBeenCalledTimes(1);
  });

  it('should refetch services when refetch is called', async () => {
    (fetchServices as jest.Mock).mockResolvedValue(mockServices);

    const { result } = renderHook(() => useFetchServices());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(fetchServices).toHaveBeenCalledTimes(1);
    expect(result.current.services).toEqual(mockServices);

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    expect(fetchServices).toHaveBeenCalledTimes(2);
    expect(result.current.services).toEqual(mockServices);
  });

  it('should update services when setServices is called', async () => {
    (fetchServices as jest.Mock).mockResolvedValue(mockServices);

    const { result } = renderHook(() => useFetchServices());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 1000 });

    const newServices = [
      {
        service_id: '3',
        service_name: 'Raje',
        status: 'active',
        description: 'For all patients',
        center_id: 'center-clinic',
      },
    ];

    act(() => {
      result.current.setServices(newServices);
    });

    expect(result.current.services).toEqual(newServices);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });
});