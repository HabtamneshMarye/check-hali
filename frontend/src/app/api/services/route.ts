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

    const clinicsResponse = await fetch(`${baseUrl}/clinics/`, {
      headers: { Authorization: authHeader },
    });

    if (!clinicsResponse.ok) {
      const detail = await clinicsResponse.text();
      return new Response(
        JSON.stringify({ error: 'Failed to load clinics', detail }),
        {
          status: clinicsResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const clinics: any[] = await clinicsResponse.json();
    const userClinicIds = clinics
      .filter((clinic) => String(clinic.user) === String(userId))
      .map((clinic) => clinic.center_id);

    if (userClinicIds.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }


    const servicesResponse = await fetch(`${baseUrl}/services/`, {
      headers: { Authorization: authHeader },
    });

    if (!servicesResponse.ok) {
      throw new Error('Failed to fetch services');
    }

    const allServices: any[] = await servicesResponse.json();
    const userServices = allServices.filter((service) =>
      userClinicIds.includes(service.center_id)
    );

    return new Response(JSON.stringify(userServices), {
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

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader?.startsWith('Token ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const { service_name, status, description, center_id } = body;

    if (!service_name || !status || !description || !center_id) {
      return new Response(JSON.stringify({ error: 'Missing required values' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!baseUrl) {
      return new Response(JSON.stringify({ error: 'BASE_URL not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(`${baseUrl}/services/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({ service_name, status, description, center_id }),
    });

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}