import { getPosProducts, getCategories } from '@/lib/actions/pos';
import { PosInterface } from '@/components/pos/PosInterface';
import { Toaster } from 'sonner';
import { auth, signOut } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProfileSettingsModal } from "@/components/admin/ProfileSettingsModal";
import { CircleUser } from "lucide-react";

import { getStoreSettings } from '@/lib/actions/settings';

export default async function PosPage() {
    const [products, categories, session, storeSettings] = await Promise.all([
        getPosProducts(),
        getCategories(),
        auth(),
        getStoreSettings(),
    ]);

    return (
        <div className="min-h-screen bg-muted/40">
            {/* Simple Header for POS */}
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 py-2 justify-between">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold tracking-tight">{storeSettings.storeName} POS</h1>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full overflow-hidden">
                                <Avatar className="h-full w-full">
                                    <AvatarImage src={session?.user?.image || undefined} alt={session?.user?.name || "User"} className="object-cover" />
                                    <AvatarFallback>
                                        <CircleUser className="h-5 w-5" />
                                    </AvatarFallback>
                                </Avatar>
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <ProfileSettingsModal user={session?.user} />
                            <DropdownMenuSeparator />
                            <form
                                action={async () => {
                                    'use server';
                                    await signOut({ redirectTo: '/login' });
                                }}
                            >
                                <button className="w-full text-left">
                                    <DropdownMenuItem>Logout</DropdownMenuItem>
                                </button>
                            </form>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <main>
                <PosInterface products={products} categories={categories} storeSettings={storeSettings} />
            </main>
            <Toaster />
        </div>
    );
}
