"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { formatEventDate, formatPrice } from "@/lib/format";
import { categoryLabels, type CommunityEvent } from "@/types/event";
import { EventStatusToggle } from "./event-status-toggle";

const columns: ColumnDef<CommunityEvent>[] = [
  {
    accessorKey: "title",
    header: "Event",
    cell: ({ row }) => (
      <div className="max-w-64">
        <p className="font-semibold">{row.original.title}</p>
        <p className="mt-1 text-xs text-muted">{row.original.city}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => categoryLabels[row.original.category],
  },
  {
    accessorKey: "startsAt",
    header: "Date & time",
    cell: ({ row }) => (
      <time dateTime={row.original.startsAt}>
        {formatEventDate(row.original.startsAt)}
      </time>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => formatPrice(row.original.price),
  },
  {
    accessorKey: "isActive",
    header: "Visibility",
    cell: ({ row }) => (
      <EventStatusToggle
        id={row.original.id}
        title={row.original.title}
        isActive={row.original.isActive}
      />
    ),
  },
];

export function EventsTable({ events }: { events: CommunityEvent[] }) {
  const table = useReactTable({
    data: events,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div
      role="region"
      aria-label="Events table, scroll horizontally on small screens"
      tabIndex={0}
      className="overflow-x-auto rounded-2xl border border-line bg-white"
    >
      <table className="w-full min-w-[760px] text-left text-sm">
        <caption className="sr-only">Manage event visibility</caption>

        <thead className="bg-elevated/70 text-xs text-muted">
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="px-5 py-4 font-medium"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-t border-line transition-colors hover:bg-blush/30"
            >
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-5 py-4">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
