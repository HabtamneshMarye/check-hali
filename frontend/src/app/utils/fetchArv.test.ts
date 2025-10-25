import { fetchArvByClinic, updateArv } from './fetchArv';

const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

describe('ARV Service', () => {
  beforeEach(() => {
    mockLocalStorage.clear();
    fetchMock.resetMocks();
  });

  describe('fetchArvByClinic', () => {
    it('should throw if not authenticated', async () => {
      await expect(fetchArvByClinic('clinic123')).rejects.toThrow('Not authenticated');
    });

    it('should return null for 404', async () => {
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce('Not Found', { status: 404 });

      const result = await fetchArvByClinic('clinic123');
      expect(result).toBeNull();
    });

    it('should throw on non-404 error', async () => {
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce('Server Error', { status: 500 });

      await expect(fetchArvByClinic('clinic123')).rejects.toThrow('Failed to fetch ARV status');
    });

    it('should return first item if array has data', async () => {
      const mockData = [{ id: 1, arv_availability: 'available', center: 'clinic123' }];
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify(mockData));

      const result = await fetchArvByClinic('clinic123');
      expect(result).toEqual(mockData[0]);
    });

    it('should return null if array is empty', async () => {
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify([]));

      const result = await fetchArvByClinic('clinic123');
      expect(result).toBeNull();
    });
  });

  describe('updateArv', () => {
    it('should throw if not authenticated', async () => {
      await expect(updateArv('clinic123', 'Available')).rejects.toThrow('Not authenticated');
    });

    it('should POST if no existing ARV record', async () => {
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify([])); 
      fetchMock.mockResponseOnce(JSON.stringify({}), { status: 201 });

      await updateArv('clinic123', 'Available');

      expect(fetchMock.mock.calls.length).toBe(2);
      const [firstCall, secondCall] = fetchMock.mock.calls;
      expect(firstCall[0]).toBe('/api/arvavailability?center=clinic123');
      expect(secondCall[0]).toBe('/api/arvavailability/');
      expect(secondCall[1]?.method).toBe('POST');
      expect(secondCall[1]?.body).toBe(JSON.stringify({
        arv_availability: 'available',
        center: 'clinic123',
      }));
    });

    it('should PUT if existing ARV record exists', async () => {
      const existingRecord = { id: 5, arv_availability: 'not available', center: 'clinic123' };
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify([existingRecord])); 
      fetchMock.mockResponseOnce(JSON.stringify({})); 

      await updateArv('clinic123', 'Available');

      expect(fetchMock.mock.calls.length).toBe(2);
      const secondCall = fetchMock.mock.calls[1];
      expect(secondCall[0]).toBe('/api/arvavailability/5/');
      expect(secondCall[1]?.method).toBe('PUT');
      expect(secondCall[1]?.body).toBe(JSON.stringify({
        arv_availability: 'available',
        center: 'clinic123',
      }));
    });

    it('should throw error on failed POST', async () => {
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify([]));
      fetchMock.mockResponseOnce('Bad Request', { status: 400 });

      await expect(updateArv('clinic123', 'Available')).rejects.toThrow('Failed to create ARV');
    });

    it('should throw error on failed PUT', async () => {
      const existingRecord = { id: 2, center: 'clinic123' };
      mockLocalStorage.setItem('token', 'valid-token');
      fetchMock.mockResponseOnce(JSON.stringify([existingRecord]));
      fetchMock.mockResponseOnce('Conflict', { status: 409 });

      await expect(updateArv('clinic123', 'Not Available')).rejects.toThrow('Failed to update ARV');
    });
  });
});