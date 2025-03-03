import { ClerkEmail } from '@/lib/actions/user';

export type ClerkUserData = {
  id: string;
  first_name: string;
  last_name: string;
  image_url: string;
  email_addresses: ClerkEmail[];
  username: string;
};