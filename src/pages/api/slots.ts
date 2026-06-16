export const prerender = false;

import type { APIRoute } from 'astro';

const CAL_API_KEY = import.meta.env.CAL_API_KEY;
const CAL_EVENT_TYPE_ID = import.meta.env.CAL_EVENT_TYPE_ID;

export const GET: APIRoute = async ({ url }) => {
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');

  if (!start || !end) {
    return new Response(JSON.stringify({ error: 'start and end are required' }), { status: 400 });
  }

  const res = await fetch(
    `https://api.cal.com/v2/slots?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&eventTypeId=${CAL_EVENT_TYPE_ID}`,
    {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
        'cal-api-version': '2024-09-04',
      },
    }
  );

  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
