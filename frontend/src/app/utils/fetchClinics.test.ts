
import { fetchClinics, updateClinic } from './fetchClinics';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();
beforeEach(() => {
  fetchMock.resetMocks();
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: jest.fn((key: string) => {
        if (key === 'token') return 'test-token';
        if (key === 'user_id') return '123';
        return null;
      }),
    },
    writable: true,
  });
});
describe('fetchClinics', () => {
  it('should return clinic data when fetch is successful', async () => {
    const mockData = [
      { id: 1, name: 'Uzima center', location: 'Nairobi, Kenya' },
      { id: 2, name: 'Melekzed', location: 'Mombasa, Kenya' },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockData), { status: 200 });
    const data = await fetchClinics();
    expect(fetchMock).toHaveBeenCalledWith('/api/clinics', {
      headers: {
        authorization: 'Token test-token', 
        'x-user-id': '123',
      },
    });
    expect(data).toEqual(mockData);
  });
  it('should throw an error when response is not ok', async () => {
    fetchMock.mockResponseOnce('Not found', { status: 404, statusText: 'Not Found' });
    await expect(fetchClinics()).rejects.toThrow('Something went wrong: Not Found');
  });
  it('should throw an error when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));
    await expect(fetchClinics()).rejects.toThrow('Network error');
  });
});
describe('updateClinic', () => {
  it('should update clinic successfully', async () => {
    const mockResponse = { id: 1, name: 'Updated Clinic' };
    fetchMock.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
    const data = await updateClinic('1', { name: 'Updated Clinic' });
    expect(fetchMock).toHaveBeenCalledWith('/api/clinics/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token test-token',
      },
      body: JSON.stringify({ name: 'Updated Clinic' }),
    });
    expect(data).toEqual(mockResponse);
  });
  it('should throw error when update response is not ok', async () => {
    fetchMock.mockResponseOnce('Bad Request', { status: 400, statusText: 'Bad Request' });
    await expect(updateClinic('1', { name: 'Invalid' }))
      .rejects
      .toThrow('Failed to update clinic: Bad Request - Bad Request');
  });
  it('should throw error when fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));
    await expect(updateClinic('1', { name: 'Clinic' })).rejects.toThrow('Network error');
  });
});









