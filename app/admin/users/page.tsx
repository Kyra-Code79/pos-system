import { PrismaClient } from '@prisma/client';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { PlusCircle, Pencil, Trash } from 'lucide-react';

import prisma from '@/lib/prisma';

import { ExportButtons } from '@/components/ExportButtons';

export default async function UsersPage() {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
    });

    const formattedUsers = users.map((user: any) => ({
        ...user,
        date: user.createdAt.toLocaleDateString()
    }));

    const pdfRows = formattedUsers.map((item: any) => [
        item.name,
        item.email,
        item.role,
        item.date
    ]);

    const excelData = formattedUsers.map((item: any) => ({
        Name: item.name,
        Email: item.email,
        Role: item.role,
        Date: item.date
    }));

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Users</h1>
                <div className="flex gap-2">
                    <ExportButtons
                        data={excelData}
                        filename="users_list"
                        pdfTitle="User List"
                        pdfColumns={['Name', 'Email', 'Role', 'Date']}
                        pdfRows={pdfRows}
                    />
                    <Link href="/admin/users/new">
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Add User
                            </span>
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="hidden md:table-cell">Created at</TableHead>
                            <TableHead>
                                <span className="sr-only">Actions</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user: any) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">
                                    {user.name}
                                </TableCell>
                                <TableCell>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary">{user.role}</Badge>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {user.createdAt.toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
