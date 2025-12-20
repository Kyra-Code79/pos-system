import prisma from '@/lib/prisma';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from '@/components/DateRangePicker';

export default async function AuditLogsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const from = resolvedSearchParams?.from as string | undefined;
    const to = resolvedSearchParams?.to as string | undefined;

    const where: any = {};

    // Date Filter
    if (from || to) {
        where.createdAt = {};
        if (from) {
            where.createdAt.gte = new Date(from);
        }
        if (to) {
            const toDate = new Date(to);
            toDate.setHours(23, 59, 59, 999);
            where.createdAt.lte = toDate;
        }
    }

    const logs = await prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, role: true } }
        },
        take: 100 // Limit to last 100
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Audit Logs</h1>
                <DateRangePicker />
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Entity</TableHead>
                            <TableHead>Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">No logs found</TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.createdAt.toLocaleString()}</TableCell>
                                    <TableCell>{log.user.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{log.user.role}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={log.action === 'DELETE' ? 'destructive' : 'default'}>
                                            {log.action}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{log.entity}</TableCell>
                                    <TableCell className="max-w-md truncate" title={log.details || ''}>
                                        {log.details}
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
