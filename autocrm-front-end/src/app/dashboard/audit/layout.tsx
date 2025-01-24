import { AuditSubscriptionProvider } from "@/providers/audit-subscription";

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Audit Logs</h2>
          <p className="text-muted-foreground">
            View and monitor system activity and changes
          </p>
        </div>
      </div>
      <AuditSubscriptionProvider>
        {children}
      </AuditSubscriptionProvider>
    </div>
  );
} 