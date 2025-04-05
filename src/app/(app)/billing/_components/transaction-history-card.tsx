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
import InvoiceButton from "./invoice-button";

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
        {!purchases && (
          <CustomAlert
            variant="destructive"
            title="Error"
            description="Something went wrong. Please try again later."
          />
        )}
        {purchases?.length === 0 && (
          <p className="text-muted-foreground">No transactions yet</p>
        )}
        {purchases?.map((purchase) => (
          <div
            key={purchase.userPurchaseId}
            className="flex items-center gap-8"
          >
            <div>{purchase.description}</div>
            <InvoiceButton purchaseId={purchase.userPurchaseId} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// function formatDate(date: Date) {
//   return Intl.DateTimeFormat("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(date);
// }
