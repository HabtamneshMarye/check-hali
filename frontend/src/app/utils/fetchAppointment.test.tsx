import { fetchAppointments } from './fetchAppointment';

beforeAll(() => {
  global.fetch = jest.fn();
});

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('fetchAppointments', () => {
  it('throws error if token is missing', async () => {
    localStorage.setItem('user_id', '123');
    await expect(fetchAppointments()).rejects.toThrow('Authentication required. Token or User ID missing.');
  });

  it('throws error if user_id is missing', async () => {
    localStorage.setItem('token', 'abc');
    await expect(fetchAppointments()).rejects.toThrow('Authentication required. Token or User ID missing.');
  });

  it('fetches appointments successfully', async () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user_id', '123');

    const mockResponse = [{ id: 1, appointment: 'Test' }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await fetchAppointments();

    expect(fetch).toHaveBeenCalledWith('/api/appointment', {
      headers: {
        Authorization: 'Token abc',
        'X-User-ID': '123',
      },
    });
    expect(result).toEqual(mockResponse);
  });

  it('throws error if fetch response is not ok', async () => {
    localStorage.setItem('token', 'abc');
    localStorage.setItem('user_id', '123');

    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(fetchAppointments()).rejects.toThrow('Failed to fetch appointments: 500 Internal Server Error');
  });
});
