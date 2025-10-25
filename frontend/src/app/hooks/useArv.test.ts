import { renderHook, act, waitFor } from '@testing-library/react';
import { useArv } from './useArv';
import { fetchArvByClinic, updateArv } from '../utils/fetchArv';

jest.mock('../utils/fetchArv', () => ({
  fetchArvByClinic: jest.fn(),
  updateArv: jest.fn(),
}));
describe('useArv hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch and set ARV status successfully', async () => {
    (fetchArvByClinic as jest.Mock).mockResolvedValueOnce({
      arv_availability: 'Available',
    });
    const { result } = renderHook(() => useArv('clinic-1'));
  
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchArvByClinic).toHaveBeenCalledWith('clinic-1');
    expect(result.current.arvStatus).toBe('Available');
    expect(result.current.error).toBeNull();
  });
  it('should handle fetch errors gracefully', async () => {
    (fetchArvByClinic as jest.Mock).mockRejectedValueOnce(
      new Error('Network Error')
    );
    const { result } = renderHook(() => useArv('clinic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Failed to load ARV status.');
    expect(result.current.arvStatus).toBe('Not Available');
  });
  it('should skip fetch if clinicId is null', async () => {
    const { result } = renderHook(() => useArv(null));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetchArvByClinic).not.toHaveBeenCalled();
    expect(result.current.arvStatus).toBe('Not Available');
  });
  it('should update ARV status successfully via saveArvStatus', async () => {
    (updateArv as jest.Mock).mockResolvedValueOnce({});
    const { result } = renderHook(() => useArv('clinic-1'));
    
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.saveArvStatus('Available');
    });
    expect(updateArv).toHaveBeenCalledWith('clinic-1', 'Available');
    expect(result.current.arvStatus).toBe('Available');
    expect(result.current.error).toBeNull();
  });
  it('should handle saveArvStatus error and revert to fetched value', async () => {
    (updateArv as jest.Mock).mockRejectedValueOnce(
      new Error('Update failed')
    );
    (fetchArvByClinic as jest.Mock).mockResolvedValueOnce({
      arv_availability: 'Not Available',
    });
    const { result } = renderHook(() => useArv('clinic-1'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      try {
        await result.current.saveArvStatus('Available');
      } catch (e) {
      
      }
    });
    expect(updateArv).toHaveBeenCalledWith('clinic-1', 'Available');
    expect(fetchArvByClinic).toHaveBeenCalledWith('clinic-1');
    expect(result.current.arvStatus).toBe('Not Available');
    expect(result.current.error).toBe('Update failed');
  });
  it('should set error if saveArvStatus called with null clinicId', async () => {
    const { result } = renderHook(() => useArv(null));
    await act(async () => {
      await result.current.saveArvStatus('Available');
    });
    expect(result.current.error).toBe('Cannot save: Clinic ID is missing.');
  });
});