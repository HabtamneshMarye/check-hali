const baseUrl = process.env.BASE_URL;

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const userId = req.headers.get('x-user-id');

    if (!authHeader?.startsWith('Token ') || !userId) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing token or user ID' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!baseUrl) {
      return new Response(
        JSON.stringify({ error: 'BASE_URL not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const clinicsResponse = await fetch(`${baseUrl}/centers/`, {
      headers: { Authorization: authHeader },
    });

    if (!clinicsResponse.ok) {
      const detail = await clinicsResponse.text();
      return new Response(
        JSON.stringify({ error: 'Failed to load user clinics from backend', detail }),
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

 
    const appointmentsResponse = await fetch(`${baseUrl}/appointment/`, {
      headers: { Authorization: authHeader },
    });

    if (!appointmentsResponse.ok) {
      throw new Error('Failed to fetch appointments from backend');
    }

    const allAppointments: any[] = await appointmentsResponse.json();
    const userAppointments = allAppointments.filter((appt) =>
      userClinicIds.includes(appt.center_id)
    );

    return new Response(JSON.stringify(userAppointments), {
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