import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import getUserPurchaseHistory from "../_data-access/get-user-purchase-history";
import { ArrowLeftRightIcon } from "lucide-react";
import CustomAlert from "@/components/custom-alert";
import { TransactionHistoryTable } from "./transaction-history-table/transaction-history-table";

export default async function TransactionHistoryCard() {
  const purchases = await getUserPurchaseHistory();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <ArrowLeftRightIcon className="stroke-primary size-6 dark:stroke-blue-500" />
          <h2>Transaction History</h2>
        </CardTitle>
        <CardDescription>
          <p>View your transaction history and download invoices</p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(!purchases || !purchases.count) && (
          <CustomAlert
            variant="destructive"
            title="Error"
            description="Something went wrong. Please try again later."
          />
        )}
        {purchases?.count === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}
        {purchases && purchases.count! > 0 && (
          <TransactionHistoryTable initialData={purchases} />
        )}
      </CardContent>
    </Card>
  );
}
