import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

export default async function ActivityPage() {
  const logs = await prisma.auditLog.findMany({
    include: { actor: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
    take: 150,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Action History</h1>
        <p className="mt-1 text-muted-foreground">Audit trail for sensitive changes, access logs, and operational accountability.</p>
      </div>
      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-left text-muted-foreground">
            <tr><th className="p-4">Time</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Entity</th><th className="p-4">IP</th></tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-border/60">
                <td className="p-4">{log.createdAt.toLocaleString()}</td>
                <td className="p-4">{log.actor?.name || log.actor?.email || "System"}</td>
                <td className="p-4 font-medium">{log.action}</td>
                <td className="p-4">{log.entity}{log.entityId ? ` / ${log.entityId.slice(0, 8)}` : ""}</td>
                <td className="p-4 text-muted-foreground">{log.ipAddress || "n/a"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
