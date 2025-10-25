import { fetchServices, addService, updateService, deleteService } from './fetchServices';

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

beforeEach(() => {
  mockLocalStorage.clear();
  jest.clearAllMocks();
});

const mockFetchSuccess = (data: any) => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: true,
    statusText: 'OK',
    json: () => Promise.resolve(data),
  });
};

const mockFetchError = (statusText = 'Bad Request') => {
  (global as any).fetch = jest.fn().mockResolvedValue({
    ok: false,
    statusText,
    json: () => Promise.resolve({}),
  });
};

describe('Service API Utils', () => {
  const mockToken = 'abc123';
  const mockUserId = 'user-456';
  const mockService = {
    service_name: 'Test Service',
    status: 'active',
    description: 'A test service',
    center_id: 'center-789',
  };

  describe('fetchServices', () => {
    it('should fetch services when authenticated', async () => {
      mockLocalStorage.setItem('token', mockToken);
      mockLocalStorage.setItem('user_id', mockUserId);
      const mockData = [{ id: '1', ...mockService }];
      mockFetchSuccess(mockData);

      const result = await fetchServices();

      expect(fetch).toHaveBeenCalledWith('/api/services', {
        headers: {
          Authorization: `Token ${mockToken}`,
          'X-User-ID': mockUserId,
        },
      });
      expect(result).toEqual(mockData);
    });

    it('should throw "Not authenticated" if token is missing', async () => {
      mockLocalStorage.setItem('user_id', mockUserId);
      await expect(fetchServices()).rejects.toThrow('Not authenticated');
    });

    it('should throw "Not authenticated" if user_id is missing', async () => {
      mockLocalStorage.setItem('token', mockToken);
      await expect(fetchServices()).rejects.toThrow('Not authenticated');
    });

    it('should throw error on fetch failure', async () => {
      mockLocalStorage.setItem('token', mockToken);
      mockLocalStorage.setItem('user_id', mockUserId);
      mockFetchError('Not Found');

      await expect(fetchServices()).rejects.toThrow('Something went wrong: Not Found');
    });
  });

  describe('addService', () => {
    it('should add a new service when authenticated', async () => {
      mockLocalStorage.setItem('token', mockToken);
      const mockResponse = { id: '1', ...mockService };
      mockFetchSuccess(mockResponse);

      const result = await addService(mockService);

      expect(fetch).toHaveBeenCalledWith('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${mockToken}`,
        },
        body: JSON.stringify(mockService),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw "Not authenticated" if token is missing', async () => {
      await expect(addService(mockService)).rejects.toThrow('Not authenticated');
    });

    it('should throw error on fetch failure', async () => {
      mockLocalStorage.setItem('token', mockToken);
      mockFetchError('Conflict');
      await expect(addService(mockService)).rejects.toThrow('Something went wrong: Conflict');
    });
  });

  describe('updateService', () => {
    it('should update a service when authenticated', async () => {
      mockLocalStorage.setItem('token', mockToken);
      const updateData = { service_name: 'Updated', status: 'inactive', description: 'Updated desc' };
      const mockResponse = { id: '1', ...updateData };
      mockFetchSuccess(mockResponse);

      const result = await updateService('1', updateData);

      expect(fetch).toHaveBeenCalledWith('/api/services/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${mockToken}`,
        },
        body: JSON.stringify(updateData),
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw "Not authenticated" if token is missing', async () => {
      await expect(updateService('1', { service_name: 'x', status: 'active', description: 'x' })).rejects.toThrow(
        'Not authenticated'
      );
    });
  });

  describe('deleteService', () => {
    it('should delete a service when authenticated', async () => {
      mockLocalStorage.setItem('token', mockToken);
      const mockResponse = { success: true };
      mockFetchSuccess(mockResponse);

      const result = await deleteService('1');

      expect(fetch).toHaveBeenCalledWith('/api/services/1', {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${mockToken}`,
        },
      });
      expect(result).toEqual(mockResponse);
    });

    it('should throw "Not authenticated" if token is missing', async () => {
      await expect(deleteService('1')).rejects.toThrow('Not authenticated');
    });
  });
});