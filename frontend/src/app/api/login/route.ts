const baseUrl = process.env.BASE_URL;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body) {
      return new Response("Request body is required", { status: 400 });
    }

    const response = await fetch(`${baseUrl}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Login failed: " + response.statusText);
    }

    const result = await response.json();

    return new Response(JSON.stringify(result), {
      status: response.status,
    });
  } catch (error) {
    return new Response("Failed to login: " + (error as Error).message, {
      status: 500,
    });
  }
}