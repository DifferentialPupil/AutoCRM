'use client';

import { useAuditStore } from '@/lib/store';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function AuditPage() {
  const { auditLogs, isLoading } = useAuditStore();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Operation</TableHead>
            <TableHead>Table</TableHead>
            <TableHead>Changed By</TableHead>
            <TableHead>Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {auditLogs.map((log) => (
            <TableRow key={log.id}>
              <TableCell>
                {new Date(log.changed_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    log.operation === 'INSERT'
                      ? 'default'
                      : log.operation === 'UPDATE'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {log.operation}
                </Badge>
              </TableCell>
              <TableCell className="capitalize">{log.table_name}</TableCell>
              <TableCell>{log.user?.email ?? 'System'}</TableCell>
              <TableCell className="max-w-md truncate">
                {log.operation === 'UPDATE' && (
                  <span className="text-sm text-muted-foreground">
                    {Object.keys(log.new_data || {}).join(', ')}
                  </span>
                )}
                {log.operation === 'INSERT' && (
                  <span className="text-sm text-muted-foreground">New record created</span>
                )}
                {log.operation === 'DELETE' && (
                  <span className="text-sm text-muted-foreground">Record deleted</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}