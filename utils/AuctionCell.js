
import React from "react";
import { Button } from "@/components/ui/button";
import { CopyClipboard } from "@/utils/CopyClipboard";
import {
  UpdatedAlert
} from "@/utils/UpdatedAlert";


const ActionCell = ({ row }) => {

  const [isUpdateAlertOpen, setIsUpdateAlertOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() => CopyClipboard(row.original.shortUrl)}
      >
        Copy URL
      </Button>
      <Button
        onClick={() => setIsUpdateAlertOpen(true)}

      >
        Edit
      </Button>
      {/* AlertOpen */}
      <UpdatedAlert
        isOpen={isUpdateAlertOpen}
        onClose={() => setIsUpdateAlertOpen(false)}
        _id={row.original.id}
      />
    </div>
  );
};

export default ActionCell;