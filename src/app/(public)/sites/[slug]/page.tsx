import { redirect, notFound } from 'next/navigation'; // הוספנו את notFound לייבוא

export default async function SiteBasePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  if (!slug) return notFound();

  // הפניה אוטומטית לעמוד הבית
  redirect(`/sites/${slug}/home`);
}