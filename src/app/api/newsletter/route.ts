import axios from 'axios';

const API_KEY = process.env.MAILERLITE_API_KEY!;
const GROUP_ID = process.env.MAILERLITE_GROUP_ID!;

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const mlRes = await axios.post(
      'https://api.mailerlite.com/api/v2/subscribers',
      {
        email,
        groups: [GROUP_ID],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-MailerLite-ApiKey': API_KEY,
        },
      }
    );

    if (mlRes.status < 200 || mlRes.status >= 300) {
      const err = mlRes.data;

      return new Response(JSON.stringify({ error: err.error?.message || 'MailerLite error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ message: 'Subscribed' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}