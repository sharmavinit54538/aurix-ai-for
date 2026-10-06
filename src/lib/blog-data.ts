export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  cover: string;
  content: string[];
};

export const posts: Post[] = [];

export const categories = ["All", "Product", "Engineering", "Design", "Updates"];
