"use client";

import { ReactNode } from "react";

interface TableProps {
  children: ReactNode;
  className?: string;
}

interface TableHeadProps {
  children: ReactNode;
}

interface TableBodyProps {
  children: ReactNode;
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  isHoverable?: boolean;
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
  isHeader?: boolean;
  align?: "left" | "center" | "right";
}

export function Table({ children, className }: TableProps) {
  return (
    <div className={`rounded-lg border border-gray-200 overflow-hidden shadow-sm ${className || ""}`}>
      <table className="w-full divide-y divide-gray-200">
        {children}
      </table>
    </div>
  );
}

export function TableHead({ children }: TableHeadProps) {
  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      {children}
    </thead>
  );
}

export function TableBody({ children }: TableBodyProps) {
  return <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>;
}

export function TableRow({ children, isHoverable = true, className }: TableRowProps) {
  return (
    <tr className={`${isHoverable ? "hover:bg-gray-50 transition-colors" : ""} ${className || ""}`}>
      {children}
    </tr>
  );
}

export function TableCell({
  children,
  isHeader = false,
  align = "left",
  className,
}: TableCellProps) {
  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  if (isHeader) {
    return (
      <th
        className={`px-6 py-3 whitespace-nowrap text-sm font-semibold text-gray-700 ${alignClass[align]} ${className || ""}`}
      >
        {children}
      </th>
    );
  }

  return (
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 ${alignClass[align]} ${className || ""}`}
    >
      {children}
    </td>
  );
}
