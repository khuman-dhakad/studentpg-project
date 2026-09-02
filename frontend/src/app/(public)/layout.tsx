import React from 'react';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 antialiased text-slate-900">
      {children}
    </div>
  );
}