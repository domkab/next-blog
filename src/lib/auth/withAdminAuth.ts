import { currentUser } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/server';

export function withAdminAuth<T = null>(
  handler: (user: User, body: T) => Promise<Response>
){
  return async (req: Request): Promise<Response> => {
    try {
      const user = await currentUser();
      const body = req.method !== 'GET' ? await req.json() : null;

      if (
        !user ||
        user.publicMetadata?.isAdmin !== true ||
        (body?.userMongoId && user.publicMetadata?.userMongoId !== body.userMongoId)
      ) {
        return new Response('Unauthorized', { status: 401 });
      }

      return await handler(user, body as T);
    } catch (error) {
      console.error('[AUTH_WRAPPER_ERROR]', error);
      return new Response('Server Error', { status: 500 });
    }
  };
}