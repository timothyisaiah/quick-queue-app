import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="p-4">
      <nav className="mb-4 border-b pb-2">Dashboard Navigation</nav>
      {children}
    </section>
  );
}
