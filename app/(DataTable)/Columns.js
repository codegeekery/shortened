"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'
// import { CopyClipboard } from "@/utils/CopyClipboard"
// import { DeleteAlert } from "@/utils/DeleteAlert"
// import { useState } from 'react';
import ActionCell from "@/utils/AuctionCell";


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


export const Columns = [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
        >
          ID
        </Button>
      )
    },
  },
  {
    id: "url",
    accessorKey: "url",
    header: ({ column }) => {
      return (
        <Button variant="ghost">
          Origin Url
        </Button>
      );
    },
    cell: ({ getValue }) => {
      const url = getValue();
      const shortenedUrl = url.length > 30 ? `${url.slice(0, 30)}...` : url;
      return (
        <div className='cursor-pointer' title={url}>
          {shortenedUrl}
        </div>
      );
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
  {
    header: 'Actions',
    cell: ({ row }) => <ActionCell row={row} />,
  },
];