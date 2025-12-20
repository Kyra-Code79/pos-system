'use client';

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

export function SalesBarChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumSignificantDigits: 3 }).format(value)}
                />
                <Tooltip cursor={{ fill: 'transparent' }} formatter={(value: number | undefined) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value || 0)} />
                <Legend />
                <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
        </ResponsiveContainer>
    )
}
