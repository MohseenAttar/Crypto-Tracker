import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import CoinRow from "./CoinRow";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import { formatPrice, formatMarketCap } from "../../utils/formatCurrency";
import { useCurrency } from "../../context/CurrencyContext";

const buildColumns = (currency) => [
  {
    id: "rank",
    accessorKey: "market_cap_rank",
    header: "#",
    enableSorting: true,
  },
  { id: "name", accessorKey: "name", header: "Coin", enableSorting: true },
  {
    id: "price",
    accessorKey: "current_price",
    header: "Price",
    enableSorting: true,
    cell: ({ getValue }) => formatPrice(getValue(), currency),
  },
  {
    id: "pct1h",
    accessorKey: "price_change_percentage_1h_in_currency",
    header: "1h %",
    enableSorting: true,
  },
  {
    id: "pct24h",
    accessorKey: "price_change_percentage_24h_in_currency",
    header: "24h %",
    enableSorting: true,
  },
  {
    id: "pct7d",
    accessorKey: "price_change_percentage_7d_in_currency",
    header: "7d %",
    enableSorting: true,
  },
  {
    id: "marketCap",
    accessorKey: "market_cap",
    header: "Mkt Cap",
    enableSorting: true,
    cell: ({ getValue }) => formatMarketCap(getValue(), currency),
  },
  { id: "sparkline", header: "7d Chart", enableSorting: false },
];

const SortIcon = ({ column }) => {
  const sorted = column.getIsSorted();
  if (!column.getCanSort()) return null;
  if (sorted === "asc")
    return <ArrowUp className="h-3 w-3 text-brand-500 dark:text-brand-400" />;
  if (sorted === "desc")
    return <ArrowDown className="h-3 w-3 text-brand-500 dark:text-brand-400" />;
  return <ArrowUpDown className="h-3 w-3 text-zinc-400 dark:text-zinc-700" />;
};

const SortableHeader = ({ column, children }) => (
  <button
    onClick={column.getToggleSortingHandler()}
    disabled={!column.getCanSort()}
    className="flex items-center gap-1 whitespace-nowrap text-left text-xs font-medium uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-800 disabled:cursor-default dark:text-zinc-500 dark:hover:text-zinc-300"
  >
    {children}
    <SortIcon column={column} />
  </button>
);

const SKELETON_WIDTHS = [24, 140, 80, 55, 55, 55, 75, 80];

const SkeletonRows = () =>
  [...Array(10)].map((_, i) => (
    <tr
      key={`skeleton-row-${i}`}
      className="border-b border-zinc-100 dark:border-zinc-800/60"
    >
      {SKELETON_WIDTHS.map((w, j) => (
        <td key={`skeleton-cell-${i}-${j}`} className="py-3 pr-4 first:pl-4">
          <LoadingSkeleton className="h-4 rounded" style={{ width: w }} />
        </td>
      ))}
    </tr>
  ));

const CoinTable = ({ data = [], isLoading }) => {
  const { currency } = useCurrency();
  const [sorting, setSorting] = useState([{ id: "rank", desc: false }]);
  const columns = useMemo(() => buildColumns(currency), [currency]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800/60">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr
              key={hg.id}
              className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/80"
            >
              {hg.headers.map((header) => (
                <th key={header.id} className="py-3 pr-4 first:pl-4">
                  {!header.isPlaceholder && (
                    <SortableHeader column={header.column}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </SortableHeader>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-zinc-100 bg-white dark:divide-zinc-800/40 dark:bg-transparent">
          {isLoading ? (
            <SkeletonRows />
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-16 text-center text-sm text-zinc-400 dark:text-zinc-600"
              >
                No coins found.
              </td>
            </tr>
          ) : (
            table
              .getRowModel()
              .rows.map((row, i) => (
                <CoinRow
                  key={row.original.id}
                  coin={row.original}
                  rank={row.original.market_cap_rank}
                  style={{ animationDelay: `${i * 20}ms` }}
                />
              ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CoinTable;
