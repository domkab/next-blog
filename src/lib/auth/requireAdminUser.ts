import { currentUser } from '@clerk/nextjs/server';

export async function requireAdminUser(expectedMongoUserId?: string) {
  const user = await currentUser();

  if (
    !user ||
    user.publicMetadata?.isAdmin !== true ||
    (expectedMongoUserId && user.publicMetadata?.userMongoId !== expectedMongoUserId)
  ) {
    throw new Error('Unauthorized');
  }

  return user;
}