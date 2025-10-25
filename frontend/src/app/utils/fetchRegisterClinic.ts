const registerClinicUrl = "/api/centers";
export async function fetchRegisterClinic(clinicData: FormData) {
  try {
    const response = await fetch(registerClinicUrl, {
      method: "POST",
      body: clinicData,
    });
    if (!response.ok) {
      const errorBody = await response.json();
      const detailedMessage = errorBody.detail || errorBody.error || "Unknown registration failure.";
      throw new Error(`Registration failed: ${detailedMessage}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to register: " + (error as Error).message);
  }
}