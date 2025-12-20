'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SalesBarChart } from './SalesBarChart';
import { CategoryPieChart } from './CategoryPieChart';

export function DashboardCharts({
    salesData,
    minDate,
    maxDate,
    categoryData
}: {
    salesData: any[],
    minDateString?: string,
    maxDateString?: string,
    // Add these optional props or just rely on passing data
    minDate?: Date,
    maxDate?: Date,
    categoryData: any[]
}) {
    return (
        <Tabs defaultValue="sales" className="space-y-4">
            <TabsList>
                <TabsTrigger value="sales">Daily Revenue</TabsTrigger>
                <TabsTrigger value="category">Sales by Category</TabsTrigger>
            </TabsList>
            <TabsContent value="sales" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Revenue</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <SalesBarChart data={salesData} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="category" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales by Category</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <CategoryPieChart data={categoryData} />
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}
