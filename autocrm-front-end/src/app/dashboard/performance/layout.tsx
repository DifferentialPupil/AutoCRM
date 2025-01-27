import { AuditSubscriptionProvider } from "@/providers/audit-subscription";

interface PerformanceLayoutProps {
  children: React.ReactNode
}

export default function PerformanceLayout({ children }: PerformanceLayoutProps) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Performance</h1>
        </div>
        <AuditSubscriptionProvider>
            <div className="flex flex-col flex-1 h-full">
            {children}
            </div>
        </AuditSubscriptionProvider>
    </div>
  )
} 