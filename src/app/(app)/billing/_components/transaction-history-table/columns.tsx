"use client";

import { formatDate, formatPrice } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import InvoiceButton from "../invoice-button";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import getUserPurchaseHistory from "../../_data-access/get-user-purchase-history";

type Payment = Exclude<
  Awaited<ReturnType<typeof getUserPurchaseHistory>>,
  null
>["data"][number];

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);

      return formatDate(date);
    },
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();

      return <span className="capitalize">{status}</span>;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return formatPrice(amount);
    },
  },
  {
    id: "invoice",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Invoice"
        className="text-right"
      />
    ),
    enableHiding: false,
    cell: ({ row }) => {
      const purchaseId = row.original.userPurchaseId;

      return (
        <div className="flex items-center justify-end">
          <InvoiceButton purchaseId={purchaseId} />
        </div>
      );
    },
  },
];
