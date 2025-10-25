const baseUrl = process.env.BASE_URL;

export async function GET(req: Request) {
  try {
    if (!baseUrl) {
      return new Response(JSON.stringify({ error: "Missing BASE_URL" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId query parameter" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authHeader = req.headers.get("Authorization") || "";
    const response = await fetch(`${baseUrl}/centers/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(
        JSON.stringify({ error: "Backend centers fetch failed", detail }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
     const centers = await response.json();
    const userHasCenter = Array.isArray(centers)
      ? centers.some((c: any) => String(c.user) === String(userId))
      : false;

    return new Response(JSON.stringify({ clinicExists: userHasCenter }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", message: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!baseUrl) {
      return new Response(
        JSON.stringify({ error: "Missing BASE_URL in environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const formData = await request.formData();

    const response = await fetch(`${baseUrl}/centers/`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(
        JSON.stringify({ error: "Registration failed", detail }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to register", detail: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
