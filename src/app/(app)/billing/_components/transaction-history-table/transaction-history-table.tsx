"use client";

import {
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import getUserPurchaseHistoryClient from "../../_data-access/get-user-purchase-history-client";
import getUserPurchaseHistoryServer from "../../_data-access/get-user-purchase-history-server";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";

type Props = {
  initialData: Awaited<ReturnType<typeof getUserPurchaseHistoryServer>>;
};

export function TransactionHistoryTable({ initialData }: Props) {
  const [newInitialData, setNewInitialData] = useState(initialData);
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "createdAt",
      desc: true,
    },
  ]);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const query = useQuery({
    queryKey: ["transaction-history", pageIndex, pageSize, sorting],
    initialData: newInitialData,
    queryFn: () =>
      getUserPurchaseHistoryClient({
        pagination: { page: pageIndex, rows: pageSize },
        sorting,
      }),
  });

  const userPurchaseHistoryData = query.data?.data ?? [];
  const rowCount = query.data?.count ?? 0;

  const table = useReactTable({
    data: userPurchaseHistoryData,
    columns,
    rowCount,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    onSortingChange: setSorting,
    manualPagination: true,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
  });

  useEffect(() => {
    // Update the initial data to prevent flashing the initialData from props
    // when fetching new data.
    setNewInitialData(query.data);
  }, [query.data]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className="first:pl-5 last:pr-5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getAllCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="first:pl-5 last:w-min last:pr-5"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
