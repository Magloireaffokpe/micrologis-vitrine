// app/admin/blog/new/page.tsx
import BlogForm from '@/components/admin/BlogForm';
export const metadata = { title: 'Nouvel article' };

export default function NewBlogPage() {
  return (
    <div>
      <h1 className="text-xl font-black text-brand-dark mb-6">Nouvel article</h1>
      <BlogForm />
    </div>
  );
}
