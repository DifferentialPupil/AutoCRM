// app/(dashboard)/layout.tsx
'use client';

import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/header';
import { useAuthStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/login");
      router.refresh();
    }
  }, [session, router]);

  return (
    <div className="h-screen flex">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Header/>
        {children}
      </main>
    </div>
  );
}