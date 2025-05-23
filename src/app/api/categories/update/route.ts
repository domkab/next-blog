import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/CategoryModel';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

type UpdateCategoryPayload = {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  userMongoId: string;
};

export const PUT = withAdminAuth<UpdateCategoryPayload>(async (_user, body) => {
  await connect();

  try {
    const updated = await Category.findByIdAndUpdate(
      body._id,
      {
        name: body.name,
        slug: body.slug,
        parent: body.parent || null,
      },
      { new: true }
    );

    if (!updated) return new Response('Category not found', { status: 404 });

    return new Response(JSON.stringify(updated), { status: 200 });
  } catch (error) {
    console.error('[CATEGORIES_UPDATE_ERROR]', error);
    return new Response('Failed to update category', { status: 500 });
  }
});