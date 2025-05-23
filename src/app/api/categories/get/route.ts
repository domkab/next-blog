import { connect } from '@/lib/mongodb/mongoose';
import Category from '@/lib/models/CategoryModel';

export const GET = async () => {
  await connect();

  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    return new Response(JSON.stringify({ categories }), { status: 200 });
  } catch (error) {
    console.error('[CATEGORIES_GET_ERROR]', error);
    return new Response('Failed to fetch categories', { status: 500 });
  }
};
