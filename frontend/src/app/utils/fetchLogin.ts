const loginUrl = "/api/login";

export async function fetchLogin(credentials: object) {
  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("Failed to login: " + (error as Error).message);
  }
}
