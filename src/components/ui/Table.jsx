import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import PropTypes from "prop-types";
import React, { useMemo } from "react";

const Table = ({ columnsData, tableData }) => {
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
        {table.getHeaderGroups().map((headerGroup) => (
          <thead
            key={headerGroup.id}
            className="bg-gray-50 dark:bg-neutral-800"
          >
            <tr>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  scope="col"
                  className="ps-6 py-3 text-start"
                >
                  <div className="flex items-center gap-x-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-neutral-200">
                      {header.column.columnDef.header}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        ))}
        <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="size-px whitespace-nowrap">
                  <div className="px-6 py-3">
                    <span>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </span>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  columnsData: PropTypes.array,
  tableData: PropTypes.array,
};

export default Table;
