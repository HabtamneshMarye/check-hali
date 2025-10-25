import { fetchRegisterClinic } from './fetchRegisterClinic';

describe('fetchRegisterClinic', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('should return result JSON on successful fetch', async () => {
    const mockResponse = { id: 'clinic1', name: 'Clinic One' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const clinicData = new FormData();
    const result = await fetchRegisterClinic(clinicData);

    expect(global.fetch).toHaveBeenCalledWith('/api/centers', {
      method: 'POST',
      body: clinicData,
    });
    expect(result).toEqual(mockResponse);
  });

  it('should throw error if fetch response is not ok', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Bad Request', error: 'Bad Request' }),
    });

    const clinicData = new FormData();

    await expect(fetchRegisterClinic(clinicData)).rejects.toThrow(
      'Registration failed: Bad Request'
    );
  });

  it('should throw error if fetch throws an error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));

    const clinicData = new FormData();

    await expect(fetchRegisterClinic(clinicData)).rejects.toThrow(
      'Failed to register: Network Error'
    );
  });
});
