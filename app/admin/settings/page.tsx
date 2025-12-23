import { getStoreSettings } from '@/lib/actions/settings';
import { getLandingPageContent } from "@/lib/actions/landing";
import { SettingsForm } from '@/components/admin/SettingsForm';
import { LandingContentForm } from "@/components/admin/LandingContentForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/auth";

export default async function SettingsPage() {
    const settings = await getStoreSettings();
    const landingContent = await getLandingPageContent();
    const session = await auth();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Settings</h3>
                <p className="text-sm text-muted-foreground">
                    Manage store details and landing page content.
                </p>
            </div>
            <Tabs defaultValue="store">
                <TabsList>
                    <TabsTrigger value="store">Store Settings</TabsTrigger>
                    <TabsTrigger value="landing">Landing Page</TabsTrigger>
                </TabsList>
                <TabsContent value="store" className="space-y-4">
                    <SettingsForm
                        initialSettings={{
                            storeName: settings!.storeName,
                            storeAddress: settings!.storeAddress,
                            storePhone: settings!.storePhone,
                            storeEmail: (settings as any).storeEmail || "",
                            storeFax: (settings as any).storeFax || "",
                        }}
                    />
                </TabsContent>
                <TabsContent value="landing" className="space-y-4">
                    <LandingContentForm initialContent={landingContent} />
                </TabsContent>
            </Tabs>
        </div>
    );
}
