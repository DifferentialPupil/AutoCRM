import { AuditSubscriptionProvider } from "@/providers/audit-subscription";

interface PerformanceLayoutProps {
  children: React.ReactNode
}

export default function PerformanceLayout({ children }: PerformanceLayoutProps) {
  return (
    <AuditSubscriptionProvider>
      <div className="flex flex-col flex-1 h-full">
        {children}
      </div>
    </AuditSubscriptionProvider>
  )
} 