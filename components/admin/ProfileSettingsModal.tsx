'use client';

import { useActionState, useState } from 'react';
import { updateProfile, changePassword } from '@/lib/actions/profile';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, EyeOff } from 'lucide-react';

export function ProfileSettingsModal({ children, user }: { children?: React.ReactNode; user: any }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        Settings
                    </DropdownMenuItem>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Profile Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account settings and preferences.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="security">Security</TabsTrigger>
                    </TabsList>
                    <TabsContent value="profile">
                        <ProfileForm user={user} />
                    </TabsContent>
                    <TabsContent value="security">
                        <PasswordForm />
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

function PasswordInput({ id, name, required }: { id: string, name: string, required?: boolean }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                id={id}
                name={name}
                type={showPassword ? 'text' : 'password'}
                required={required}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                )}
                <span className="sr-only">
                    {showPassword ? 'Hide password' : 'Show password'}
                </span>
            </Button>
        </div>
    );
}

function ProfileForm({ user }: { user: any }) {
    const [state, action, isPending] = useActionState(updateProfile, null);

    // Initials logic: First 2 letters of the name, uppercase.
    const initials = user?.name
        ? user.name.substring(0, 2).toUpperCase()
        : 'US';

    return (
        <form action={action} className="space-y-4 py-4">
            {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <div className="flex flex-col items-center gap-4">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={user?.image} alt={user?.name} className="object-cover" />
                    <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="image" className="text-center">Profile Picture</Label>
                    <Input id="image" name="image" type="file" accept="image/*" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" defaultValue={user?.name} required />
                {state?.errors?.name && (
                    <p className="text-sm text-red-500">{state.errors.name}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Changes'}
                </Button>
            </DialogFooter>
        </form>
    );
}

function PasswordForm() {
    const [state, action, isPending] = useActionState(changePassword, null);

    return (
        <form action={action} className="space-y-4 py-4">
            {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <PasswordInput id="currentPassword" name="currentPassword" required />
                {state?.errors?.currentPassword && (
                    <p className="text-sm text-red-500">{state.errors.currentPassword}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <PasswordInput id="newPassword" name="newPassword" required />
                {/* Helper text for password requirements */}
                <p className="text-xs text-muted-foreground">
                    Min 6 characters, at least 1 special char (!@#$...).
                </p>
                {state?.errors?.newPassword && (
                    <p className="text-sm text-red-500">{state.errors.newPassword}</p>
                )}
            </div>
            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <PasswordInput id="confirmPassword" name="confirmPassword" required />
                {state?.errors?.confirmPassword && (
                    <p className="text-sm text-red-500">{state.errors.confirmPassword}</p>
                )}
            </div>
            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Update Password' : 'Change Password'}
                </Button>
            </DialogFooter>
        </form>
    );
}
