'use client';

import { Sidebar } from '@/components/Sidebar';
import { NotificationProvider } from '@/components/WhatsAppNotificationCenter';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 bg-gray-50">
          {children}
        </main>
      </div>
    </NotificationProvider>
  );
}
