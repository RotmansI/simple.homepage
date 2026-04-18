"use client";

import React from 'react';

// הלייאאוט הזה מסתיר את ה-Header המשותף
export default function EditorRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-brand-grey overflow-hidden flex flex-col z-[100]">
      {children}
    </div>
  );
}