const baseUrl = '/api/clinics';

export async function fetchClinics() {
  if (typeof window === 'undefined') {
    throw new Error('fetchClinics should only be called on the client');
  }
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  if (!token || !userId) {
    throw new Error('Not authenticated');
  }
  try {
    const response = await fetch(baseUrl, {
      headers: {
        'authorization': `Token ${token}`,
        'x-user-id': userId,
      },
    });
    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.statusText}`);
    }
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to fetch clinics');
  }
}

export async function updateClinic(clinicId: string, data: any) {
  if (typeof window === 'undefined') {
    throw new Error('updateClinic should only be called on the client');
  }
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');
  try {
    const response = await fetch(`${baseUrl}/${clinicId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update clinic: ${response.statusText} - ${errorText}`);
    }
    return await response.json();
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update clinic');
  }
}







