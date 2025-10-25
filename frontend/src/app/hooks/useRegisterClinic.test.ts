import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';
import useRegisterClinic from '../hooks/useRegisterClinic'; 
import * as fetchModule from '../utils/fetchRegisterClinic';

jest.mock('../utils/fetchRegisterClinic');

describe('useRegisterClinic', () => {
  const mockFetchRegisterClinic = fetchModule.fetchRegisterClinic as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with loading false and error null', () => {
    const { result } = renderHook(() => useRegisterClinic());
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set loading true during register and then false after success', async () => {
    mockFetchRegisterClinic.mockResolvedValueOnce({ id: 'clinic1' });
    const { result } = renderHook(() => useRegisterClinic());

    act(() => {
      result.current.registerClinic(new FormData());
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
  });

  it('should return data on successful registration', async () => {
    const fakeData = { id: '15' };
    mockFetchRegisterClinic.mockResolvedValueOnce(fakeData);
    const { result } = renderHook(() => useRegisterClinic());

    let data;
    await act(async () => {
      data = await result.current.registerClinic(new FormData());
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(data).toEqual(fakeData);
    expect(result.current.error).toBeNull();
  });

  it('should set error on failure', async () => {
    const errorMessage = 'Network error';
    mockFetchRegisterClinic.mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useRegisterClinic());

    let data;
    await act(async () => {
      data = await result.current.registerClinic(new FormData());
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(data).toBeNull();
    expect(result.current.error).toBe(errorMessage);
  });
});
