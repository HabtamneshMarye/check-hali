export async function fetchArvByClinic(clinicId: string) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await fetch(`/api/arvavailability?center=${clinicId}`, {
      headers: { Authorization: `Token ${token}` },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch ARV status');
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    throw new Error('Failed to fetch ARV status: ' + (error as Error).message);
  }
}

export async function updateArv(clinicId: string, arvStatus: 'Available' | 'Not Available') {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const payload = {
      arv_availability: arvStatus === 'Available' ? 'available' : 'not available',
      center: clinicId,
    };

    const existingArv = await fetchArvByClinic(clinicId);

    if (existingArv && existingArv.id) {
      const response = await fetch(`/api/arvavailability/${existingArv.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update ARV: ${errorText}`);
      }
    } else {
      const response = await fetch('/api/arvavailability/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create ARV: ${errorText}`);
      }
    }
  } catch (error) {
    throw new Error('Failed to update ARV: ' + (error as Error).message);
  }
}