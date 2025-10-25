const baseUrl = process.env.BASE_URL; 

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = req.headers.get('x-user-id');

    if (!authHeader?.startsWith('Token ') || !userId) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!baseUrl) {
      return new Response(JSON.stringify({ error: 'BASE_URL not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${baseUrl}/clinics/`, {
      headers: {
        'Authorization': authHeader,
      },
    });

    if (!response.ok) {
      const detail = await response.text();
      return new Response(
        JSON.stringify({ error: 'Failed to fetch clinics', detail }),
        {
          status: response.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const allClinics: any[] = await response.json();
    const userClinics = allClinics.filter((clinic) => String(clinic.user) === String(userId));

    return new Response(JSON.stringify(userClinics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: (error as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}