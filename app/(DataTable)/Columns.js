"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const Columns = [
  {
    id: "url",
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Origin Url
        </Button>
      )
    },
  },
  {
    id: "shortUrl",
    accessorKey: "shortUrl",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          Shortened Url
        </Button>
      )
    },
  },
  {
    id: "clicks",
    accessorKey: "clicks",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Clicks
          <ArrowUpDown size={20} className="ml-1" />
        </Button>
      )
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown size={20} className="ml-1" />
        </Button>
      )
    },
  },
];