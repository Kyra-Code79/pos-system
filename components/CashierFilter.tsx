"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CashierFilterProps {
  cashiers: { id: string; name: string }[]
}

export function CashierFilter({ cashiers }: CashierFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCashier = searchParams.get("cashierId") || "all"

  const handleValueChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== "all") {
      params.set("cashierId", value)
    } else {
      params.delete("cashierId")
    }
    router.push(`?${params.toString()}`)
  }

  return (
    <Select value={currentCashier} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by Cashier" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Cashiers</SelectItem>
        {cashiers.map((cashier) => (
          <SelectItem key={cashier.id} value={cashier.id}>
            {cashier.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
