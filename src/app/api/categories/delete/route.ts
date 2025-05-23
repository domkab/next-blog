import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/CategoryModel';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

type DeleteCategoryPayload = {
  categoryId: string;
  userMongoId: string;
};

export const DELETE = withAdminAuth<DeleteCategoryPayload>(async (_user, body) => {
  await connect();

  try {
    const deleted = await Category.findByIdAndDelete(body.categoryId);
    if (!deleted) return new Response('Category not found', { status: 404 });

    return new Response('Category deleted', { status: 200 });
  } catch (error) {
    console.error('[CATEGORIES_DELETE_ERROR]', error);
    return new Response('Failed to delete category', { status: 500 });
  }
});