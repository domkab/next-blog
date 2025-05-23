import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/CategoryModel';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

type CreateCategoryPayload = {
  name: string;
  slug: string;
  parent?: string | null;
  userMongoId: string;
};

export const POST = withAdminAuth<CreateCategoryPayload>(async (_user, body) => {
  await connect();

  try {
    const exists = await Category.findOne({ slug: body.slug });
    if (exists) {
      return new Response('Category with this slug already exists.', { status: 409 });
    }

    const newCategory = await Category.create({
      name: body.name,
      slug: body.slug,
      parent: body.parent || null,
    });

    return new Response(JSON.stringify(newCategory), { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST_ERROR]', error);
    return new Response('Failed to create category', { status: 500 });
  }
});