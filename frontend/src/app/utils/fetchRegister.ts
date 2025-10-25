const registerUrl = "/api/register";

export async function fetchRegister(userData: object) {
  try {
    const response = await fetch(registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Registration failed: " + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to register: " + (error as Error).message);
  }
}
