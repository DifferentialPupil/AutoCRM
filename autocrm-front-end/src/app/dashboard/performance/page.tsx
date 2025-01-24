'use client';

import { useAuditStore } from "@/lib/store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PerformancePage() {
  const { auditLogs, isLoading } = useAuditStore();

  // Filter audit logs for ticket insertions
  const ticketInsertions = auditLogs
    .filter(log => log.table_name === 'tickets')
    .map(log => ({
      ...log,
      ticketData: log.new_data as { title: string; status: string; priority: string }
    }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Performance</h2>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Ticket Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : ticketInsertions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No ticket insertions found
                </TableCell>
              </TableRow>
            ) : (
              ticketInsertions.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {new Date(log.changed_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.ticketData.title}</TableCell>
                  <TableCell>{log.ticketData.status}</TableCell>
                  <TableCell>{log.ticketData.priority}</TableCell>
                  <TableCell>
                    {log.user?.email || 'Unknown'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 