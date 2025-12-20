'use client';

import { useActionState } from 'react';
import { createUser } from '@/lib/actions/user';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Link from 'next/link';

export default function CreateUserPage() {
    const initialState = { message: "", errors: {} };
    const [state, dispatch] = useActionState(createUser, initialState);

    return (
        <div className="flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Create User</CardTitle>
                    <CardDescription>
                        Add a new user to the system.
                    </CardDescription>
                </CardHeader>
                <form action={dispatch}>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="John Doe" />
                            <div id="name-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.name &&
                                    state.errors.name.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="john@pos.com" />
                            <div id="email-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.email &&
                                    state.errors.email.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" />
                            <div id="password-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.password &&
                                    state.errors.password.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue="CASHIER">
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                    <SelectItem value="MANAGEMENT">Management</SelectItem>
                                    <SelectItem value="CASHIER">Cashier</SelectItem>
                                </SelectContent>
                            </Select>
                            <div id="role-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.role &&
                                    state.errors.role.map((error: string) => (
                                        <p className="mt-2 text-sm text-red-500" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </div>

                        <div aria-live="polite" aria-atomic="true">
                            {state.message && (
                                <p className="mt-2 text-sm text-red-500" key={state.message}>
                                    {state.message}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end gap-2">
                        <Link href="/admin/users">
                            <Button variant="ghost">Cancel</Button>
                        </Link>
                        <Button type="submit">Save User</Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
