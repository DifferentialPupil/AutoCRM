// components/dashboard/sidebar.tsx
'use client';

import { cn } from '@/lib/utils';
import { useUIStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Ticket,
  Settings,
  Users,
  MessageSquare,
  LineChart,
  History
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Tickets',
    href: '/dashboard/tickets',
    icon: Ticket,
    description: 'Manage support tickets'
  },
  {
    title: 'Customers',
    href: '/dashboard/customers',
    icon: Users,
    description: 'Customer management'
  },
  {
    title: 'Messages',
    href: '/dashboard/messages',
    icon: MessageSquare,
    description: 'Communication center'
  },
  {
    title: 'Performance',
    href: '/dashboard/performance',
    icon: LineChart,
    description: 'Performance analytics and tools'
  },
  {
    title: 'Audit',
    href: '/dashboard/audit',
    icon: History,
    description: 'System audit logs'
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration'
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <aside
      className={cn(
        'h-screen border-r bg-background transition-all duration-300',
        sidebarOpen ? 'w-56' : 'w-16',
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {sidebarOpen && (
          <span className="text-lg font-semibold">
            AutoCRM
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="ml-auto"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="space-y-1 p-2" aria-label="Main">
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-x-3 px-3 py-2 rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                !sidebarOpen && 'justify-center'
              )}
              aria-current={isActive ? 'page' : undefined}
              title={!sidebarOpen ? item.title : undefined}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {sidebarOpen && <span>{item.title}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}