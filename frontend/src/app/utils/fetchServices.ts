const baseUrl = '/api/services';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_id');
};

export async function fetchServices() {
  const token = getToken();
  const userId = getUserId();

  if (!token || !userId) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(baseUrl, {
      headers: {
        Authorization: `Token ${token}`,
        'X-User-ID': userId,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to fetch services: ' + (error as Error).message);
  }
}

export async function addService(service: {service_name: string; status: string; description: string; center_id: string;}) {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to add service: ' + (error as Error).message);
  }
}

export async function updateService(id: string, service: { service_name: string;status: string; description: string;}) {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`/api/services/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(service),
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to update service: ' + (error as Error).message);
  }
}

export async function deleteService(id: string) {
  const token = getToken();
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`/api/services/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Token ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Something went wrong: ' + response.statusText);
    }

    return await response.json();
  } catch (error) {
    throw new Error('Failed to delete service: ' + (error as Error).message);
  }
}