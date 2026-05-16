import { redirect, notFound } from 'next/navigation';

export default async function DraftBasePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  
  if (!slug) return notFound();

  // הפניה אוטומטית לעמוד הבית של הטיוטה עבור המשתמש המחובר
  redirect(`/draft/${slug}/home`);
}