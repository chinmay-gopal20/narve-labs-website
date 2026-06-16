export const prerender = false;

import type { APIRoute } from 'astro';

const CAL_API_KEY = import.meta.env.CAL_API_KEY;
const CAL_EVENT_TYPE_ID = import.meta.env.CAL_EVENT_TYPE_ID;

export const POST: APIRoute = async ({ request }) => {
  const { start, name, email, timeZone } = await request.json();

  if (!start || !name || !email || !timeZone) {
    return new Response(JSON.stringify({ error: 'start, name, email and timeZone are required' }), { status: 400 });
  }

  const res = await fetch('https://api.cal.com/v2/bookings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CAL_API_KEY}`,
      'cal-api-version': '2024-08-13',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start,
      eventTypeId: Number(CAL_EVENT_TYPE_ID),
      attendee: { name, email, timeZone },
    }),
  });

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
