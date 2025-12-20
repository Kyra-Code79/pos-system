"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    limit: number
    totalItems: number
}

export function PaginationControls({
    currentPage,
    totalPages,
    limit,
    totalItems,
}: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`)
    }

    const handleLimitChange = (newLimit: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("limit", newLimit)
        params.set("page", "1") // Reset to page 1 on limit change
        router.push(`?${params.toString()}`)
    }

    return (
        <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground mr-2">
                    Rows per page
                </p>
                <Select
                    value={limit.toString()}
                    onValueChange={handleLimitChange}
                >
                    <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue placeholder={limit.toString()} />
                    </SelectTrigger>
                    <SelectContent side="top">
                        {[25, 50, 100].map((pageSize) => (
                            <SelectItem key={pageSize} value={pageSize.toString()}>
                                {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground ml-2">
                    Showing {Math.min(limit * (currentPage - 1) + 1, totalItems)} - {Math.min(limit * currentPage, totalItems)} of {totalItems}
                </p>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <span className="sr-only">Go to previous page</span>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    className="h-8 w-8 p-0"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    <span className="sr-only">Go to next page</span>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}
