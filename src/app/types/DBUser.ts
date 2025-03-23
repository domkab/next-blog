import { ClerkUserData } from './ClerkUserData';

export interface DBUser extends ClerkUserData {
  _id: string;
  createdAt: string;
  profilePicture: string;
  email: string;
  isAdmin: boolean;
}