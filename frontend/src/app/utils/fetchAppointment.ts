const baseUrl = '/api/appointment';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_id');
};

export async function fetchAppointments() {
  const token = getToken();
  const userId = getUserId();

  if (!token || !userId) {
    throw new Error('Authentication required. Token or User ID missing.');
  }

  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Token ${token}`,
        'X-User-ID': userId,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch appointments: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch appointments: ' + (error as Error).message);
  }
}