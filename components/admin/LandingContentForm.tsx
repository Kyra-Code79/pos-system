'use client';

import { useActionState, useState, useEffect } from "react";
import { updateLandingPageContent } from "@/lib/actions/landing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Trash2, LayoutDashboard, BarChart3, ShieldCheck, ShoppingCart, Users, Settings } from "lucide-react";

const AVAILABLE_ICONS = [
    { name: "LayoutDashboard", icon: LayoutDashboard },
    { name: "BarChart3", icon: BarChart3 },
    { name: "ShieldCheck", icon: ShieldCheck },
    { name: "ShoppingCart", icon: ShoppingCart },
    { name: "Users", icon: Users },
    { name: "Settings", icon: Settings }
];

export function LandingContentForm({ initialContent }: { initialContent: any }) {
    const [state, action, isPending] = useActionState(updateLandingPageContent, null);
    const [features, setFeatures] = useState<any[]>([]);
    const [pricingPlans, setPricingPlans] = useState<any[]>([]);

    useEffect(() => {
        if (initialContent) {
            setFeatures(Array.isArray(initialContent.features) ? initialContent.features : []);
            setPricingPlans(Array.isArray(initialContent.pricingPlans) ? initialContent.pricingPlans : []);
        }
    }, [initialContent]);

    const addFeature = () => {
        setFeatures([...features, { title: "", description: "", icon: "LayoutDashboard" }]);
    };

    const removeFeature = (index: number) => {
        const newFeatures = [...features];
        newFeatures.splice(index, 1);
        setFeatures(newFeatures);
    };

    const updateFeature = (index: number, field: string, value: string) => {
        const newFeatures = [...features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFeatures(newFeatures);
    };

    const addPricingPlan = () => {
        setPricingPlans([...pricingPlans, { name: "New Plan", price: "$0", features: [], highlight: false }]);
    };

    const removePricingPlan = (index: number) => {
        const newPlans = [...pricingPlans];
        newPlans.splice(index, 1);
        setPricingPlans(newPlans);
    };

    const updatePricingPlan = (index: number, field: string, value: any) => {
        const newPlans = [...pricingPlans];
        newPlans[index] = { ...newPlans[index], [field]: value };
        setPricingPlans(newPlans);
    };

    const updatePricingFeatures = (index: number, text: string) => {
        const featuresList = text.split('\n').filter(line => line.trim() !== '');
        updatePricingPlan(index, 'features', featuresList);
    };

    return (
        <form action={action} className="space-y-6">
            <input type="hidden" name="features" value={JSON.stringify(features)} />
            <input type="hidden" name="pricingPlans" value={JSON.stringify(pricingPlans)} />

            {state?.message && (
                <Alert variant={state.success ? "default" : "destructive"}>
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                    <CardDescription>Customize the main welcome section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="heroTitle">Hero Title</Label>
                        <Input
                            id="heroTitle"
                            name="heroTitle"
                            defaultValue={initialContent?.heroTitle}
                            placeholder="Welcome to Our POS System"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroDescription">Hero Description</Label>
                        <Textarea
                            id="heroDescription"
                            name="heroDescription"
                            defaultValue={initialContent?.heroDescription}
                            placeholder="The best solution..."
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="heroImage">Hero Image Path</Label>
                        <Input
                            id="heroImage"
                            name="heroImage"
                            defaultValue={initialContent?.heroImage}
                            placeholder="/pos-tab.png"
                            required
                        />
                        <p className="text-xs text-muted-foreground">Path to image in public folder (e.g. /pos-tab.png)</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Features</CardTitle>
                        <CardDescription>Highlight key selling points.</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="h-4 w-4 mr-2" /> Add Feature
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {features.map((feature, index) => (
                        <div key={index} className="grid gap-4 md:grid-cols-12 items-start border p-4 rounded-md">
                            <div className="md:col-span-11 grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Title</Label>
                                    <Input
                                        value={feature.title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateFeature(index, 'title', e.target.value)}
                                        placeholder="Feature Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Icon</Label>
                                    <Select
                                        value={feature.icon}
                                        onValueChange={(value) => updateFeature(index, 'icon', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Icon" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {AVAILABLE_ICONS.map((item) => (
                                                <SelectItem key={item.name} value={item.name}>
                                                    <div className="flex items-center gap-2">
                                                        <item.icon className="h-4 w-4" />
                                                        <span>{item.name}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label>Description</Label>
                                    <Textarea
                                        value={feature.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateFeature(index, 'description', e.target.value)}
                                        placeholder="Feature Description"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {features.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No features added yet.
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Pricing Plans</CardTitle>
                        <CardDescription>Manage subscription plans (Name, Price, Features)</CardDescription>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addPricingPlan}>
                        <Plus className="h-4 w-4 mr-2" /> Add Plan
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {pricingPlans.map((plan, index) => (
                        <div key={index} className="grid gap-4 md:grid-cols-12 items-start border p-4 rounded-md">
                            <div className="md:col-span-11 grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Plan Name</Label>
                                    <Input
                                        value={plan.name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePricingPlan(index, 'name', e.target.value)}
                                        placeholder="Basic, Pro, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price (e.g. $20)</Label>
                                    <Input
                                        value={plan.price}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updatePricingPlan(index, 'price', e.target.value)}
                                        placeholder="$0"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <Label>Features (One per line)</Label>
                                    <Textarea
                                        defaultValue={Array.isArray(plan.features) ? plan.features.join('\n') : ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updatePricingFeatures(index, e.target.value)}
                                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                        className="min-h-[100px]"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-2">
                                    <Label className="cursor-pointer flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={plan.highlight || false}
                                            onChange={(e) => updatePricingPlan(index, 'highlight', e.target.checked)}
                                            className="h-4 w-4"
                                        />
                                        Highlight this plan (e.g. Best Value)
                                    </Label>
                                </div>
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="icon" onClick={() => removePricingPlan(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </div>
                    ))}
                    {pricingPlans.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            No pricing plans added.
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end">
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Landing Page Changes"}
                </Button>
            </div>
        </form>
    );
}
