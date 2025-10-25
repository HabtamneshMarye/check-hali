const checkClinicUrl = "/api/centers";

export async function fetchCheckClinic(userId: string, token: string): Promise<{ clinicExists: boolean }> {
  try {
    const res = await fetch(`${checkClinicUrl}?userId=${userId}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    if (!res.ok) {
      const errorBody = await res.json();
      const errorMessage = errorBody?.error || `Status: ${res.status}`;
      throw new Error(`Clinic check failed: ${errorMessage}. Details: ${errorBody.detail || 'No further details.'}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error("Failed to check clinic: " + (error as Error).message);
  }
}
