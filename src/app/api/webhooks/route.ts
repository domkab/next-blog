/* eslint-disable @typescript-eslint/no-unused-vars */
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { clerkClient, UserJSON, WebhookEvent } from '@clerk/nextjs/server'
import { ClerkEmail, CreateOrUpdateUser, deleteUser } from '@/lib/actions/user'
import { ClerkUserData } from '@/types/ClerkUserData'

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.SIGNING_SECRET

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add SIGNING_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Create new Svix instance with secret
  const wh = new Webhook(SIGNING_SECRET)

  // Get headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', {
      status: 400,
    })
  }

  // Get body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  let evt: WebhookEvent

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', {
      status: 400,
    })
  }

  // Do something with payload
  // For this guide, log payload to console
  const { id } = evt?.data
  const eventType = evt?.type
  console.log(`Received webhook with ID ${id} and event type of ${eventType}`)
  console.log('Webhook payload:', body)

  if (eventType === 'user.created' || evt.type === 'user.updated') {
    const {
      id,
      first_name,
      last_name,
      image_url,
      email_addresses,
      username
    } = evt.data as ClerkUserData;

    try {
      const user = await CreateOrUpdateUser(
        id,
        first_name,
        last_name,
        image_url,
        email_addresses,
        username
      );

      const client = await clerkClient();

      if (user && eventType === 'user.created') {
        try {
          await client.users.updateUserMetadata(id, {
            publicMetadata: {
              userMongoId: user._id,
              isAdmin: user.isAdmin,
            }
          });
        } catch (error) {
          console.log('Error updating user metadata:', error);

          return new Response(
            'Error occured while creating user', { status: 400 }
          )
        }
      }
    } catch (error) {
      console.log('Error creating or updating user.:', error);
      return new Response('Error occured', { status: 400 })
    };
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    if (id) {
      try {
        await deleteUser(id);
      } catch (error) {
        console.log('Error while deleting user:', error);
        return new Response('Error occured', { status: 400 })
      }
    }
  }

  return new Response('Webhook received', { status: 200 })
}