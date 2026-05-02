import React, { Suspense } from 'react';
import AdminManagementClient from './AdminManagementClient';
import { Loader2 } from 'lucide-react';

export default function AdminManagementPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen bg-brand-grey/20">
          <Loader2 className="animate-spin text-brand-main" size={48} />
        </div>
      }
    >
      <AdminManagementClient />
    </Suspense>
  );
}