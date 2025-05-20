import { currentUser } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/server';

export function withAdminAuth<T = Request | null>(
  handler: (user: User, body: T) => Promise<Response>
) {
  return async (req: Request): Promise<Response> => {
    try {
      const user = await currentUser();

      const contentType = req.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const body = req.method !== 'GET' && isJson ? await req.json() : req;

      const maybeHasUserMongoId = body as { userMongoId?: string };

      if (
        !user ||
        user.publicMetadata?.isAdmin !== true ||
        (isJson &&
          maybeHasUserMongoId.userMongoId &&
          user.publicMetadata?.userMongoId !== maybeHasUserMongoId.userMongoId)
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