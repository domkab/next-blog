// import { ClerkEmail } from '@/lib/actions/user';
// import { WebhookEvent } from '@clerk/nextjs/server';

// export function isValidUserData(data: Partial<WebhookEvent['data']>): data is {
//   id: string,
//   first_name: string,
//   last_name: string,
//   image_url: string,
//   email_addresses: ClerkEmail[],
//   username: string
// } {
//   return !!data.id && !!data.first_name && !!data.last_name && !!data.image_url && !!data.email_addresses && !!data.username;;
// }