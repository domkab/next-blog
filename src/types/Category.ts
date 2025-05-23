export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
}