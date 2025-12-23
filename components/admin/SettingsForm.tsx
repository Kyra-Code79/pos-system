'use client';

import { useActionState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { updateStoreSettings } from '@/lib/actions/settings';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface SettingsFormProps {
    initialSettings: {
        storeName: string;
        storeAddress: string;
        storePhone: string;
        storeEmail?: string;
        storeFax?: string;
    };
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [state, action, isPending] = useActionState(updateStoreSettings, null);

    useEffect(() => {
        if (state?.success) {
            toast.success(state.message);
        } else if (state?.message) {
            toast.error(state.message);
        }
    }, [state]);

    return (
        <form action={action}>
            <Card>
                <CardHeader>
                    <CardTitle>Receipt Settings</CardTitle>
                    <CardDescription>
                        Configure the store details that will appear on the printed receipts.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input
                            id="storeName"
                            name="storeName"
                            defaultValue={initialSettings.storeName}
                            disabled={isPending}
                        />
                        {state?.errors?.storeName && (
                            <p className="text-sm text-red-500">{state.errors.storeName}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeAddress">Store Address</Label>
                        <Input
                            id="storeAddress"
                            name="storeAddress"
                            defaultValue={initialSettings.storeAddress}
                            disabled={isPending}
                        />
                        {state?.errors?.storeAddress && (
                            <p className="text-sm text-red-500">{state.errors.storeAddress}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storePhone">Store Phone</Label>
                        <Input
                            id="storePhone"
                            name="storePhone"
                            defaultValue={initialSettings.storePhone}
                            disabled={isPending}
                        />
                        {state?.errors?.storePhone && (
                            <p className="text-sm text-red-500">{state.errors.storePhone}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeEmail">Store Email</Label>
                        <Input
                            id="storeEmail"
                            name="storeEmail"
                            type="email"
                            defaultValue={initialSettings.storeEmail}
                            disabled={isPending}
                        />
                        {state?.errors?.storeEmail && (
                            <p className="text-sm text-red-500">{state.errors.storeEmail}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="storeFax">Store Fax (Optional)</Label>
                        <Input
                            id="storeFax"
                            name="storeFax"
                            defaultValue={initialSettings.storeFax}
                            disabled={isPending}
                        />
                        {state?.errors?.storeFax && (
                            <p className="text-sm text-red-500">{state.errors.storeFax}</p>
                        )}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
}
