import { auth } from "@/auth";
import { TransactionHistoryClient } from "@/components/manager/TransactionHistoryClient";

export default async function TransactionsPage() {
    const session = await auth();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Transaction History</h2>
            </div>
            <TransactionHistoryClient />
        </div>
    );
}
