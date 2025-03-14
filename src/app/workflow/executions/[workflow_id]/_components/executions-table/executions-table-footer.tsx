import { Button } from "@/components/ui/button";
import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";
import getAllWorkflowExecutionsClient from "../../_data-access/get-all-workflow-executions-client";

const rowsPerPageOptions = ["5", "10", "25", "All"] as const;
enum PaginationButtonType {
  "first",
  "previous",
  "next",
  "last",
}

type Props = {
  queryData: Awaited<ReturnType<typeof getAllWorkflowExecutionsClient>>;
  rangeStart: number;
  rangeEnd: number;
  rowsPerPage: number;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
};

export default function ExecutionsTableFooter({
  queryData,
  rangeStart,
  rangeEnd,
  rowsPerPage,
  setRowsPerPage,
  page,
  setPage,
}: Props) {
  const totalRows = queryData?.count ?? 0;
  const pagination = calculatePagination();
  const paginationButtons = getPaginationButtons();
  const rangeEndIndicator = rangeEnd < totalRows ? rangeEnd : totalRows;

  return (
    <div className="bg-muted flex items-center justify-between gap-4 overflow-x-auto p-2">
      <div className="flex shrink-0 items-center gap-2">
        <span>Rows per page:</span>
        <Select
          value={getSelectValue()}
          onValueChange={(value) =>
            handleRowsPerPageChange(
              value as (typeof rowsPerPageOptions)[number],
            )
          }
        >
          <SelectTrigger className="hover:bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {rowsPerPageOptions.map((rows) => (
              <SelectItem key={rows} value={rows} className="capitalize">
                {rows}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span>
          {rangeStart}-{rangeEndIndicator} of {totalRows}
        </span>
        <div className="flex items-center gap-2">
          {paginationButtons.map(({ type, icon, disabled }) => (
            <Button
              key={type}
              disabled={disabled}
              onClick={() => handlePageChange(type)}
              variant="outline"
              size="icon"
              className="hover:bg-background rounded-full"
            >
              {icon}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  function calculatePagination() {
    const itemsLength = queryData?.workflowExecutions.length ?? 0;

    const isEndOfData = rangeStart + itemsLength >= totalRows;
    const lastPageNumber = Math.max(
      Math.ceil(totalRows / Number(rowsPerPage)),
      1,
    );

    return { isEndOfData, lastPageNumber };
  }

  function handleRowsPerPageChange(value: (typeof rowsPerPageOptions)[number]) {
    const newRowsPerPage = value === "All" ? totalRows : Number(value);

    setRowsPerPage(newRowsPerPage);
    setPage(1);
  }

  function handlePageChange(value: PaginationButtonType) {
    if (value === PaginationButtonType.first) setPage(1);
    if (value === PaginationButtonType.previous)
      setPage((prev) => (prev !== 1 ? prev - 1 : prev));
    if (value === PaginationButtonType.next)
      setPage((prev) => (prev !== pagination.lastPageNumber ? prev + 1 : prev));
    if (value === PaginationButtonType.last) setPage(pagination.lastPageNumber);
  }

  function getSelectValue() {
    return rowsPerPageOptions.includes(
      `${rowsPerPage}` as (typeof rowsPerPageOptions)[number],
    )
      ? `${rowsPerPage}`
      : "All";
  }

  function getPaginationButtons() {
    return [
      {
        type: PaginationButtonType.first,
        icon: <ChevronFirstIcon />,
        disabled: page === 1,
      },
      {
        type: PaginationButtonType.previous,
        icon: <ChevronLeftIcon />,
        disabled: page === 1,
      },
      {
        type: PaginationButtonType.next,
        icon: <ChevronRightIcon />,
        disabled: pagination.isEndOfData,
      },
      {
        type: PaginationButtonType.last,
        icon: <ChevronLastIcon />,
        disabled: pagination.isEndOfData,
      },
    ];
  }
}
