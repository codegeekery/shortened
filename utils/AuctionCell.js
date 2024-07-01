import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CopyClipboard } from "@/utils/CopyClipboard";
import { DeleteAlert } from "@/utils/DeleteAlert";

const ActionCell = ({ row }) => {
    
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant='black'
        onClick={() => CopyClipboard(row.original.shortUrl)}
      >
        Copy URL
      </Button>
      <Button
        variant="destructive"
        className='w-full'
        onClick={()=> {setIsDeleteAlertOpen(true)}}
      >
        Delete
      </Button>

      {/* Dialog Alert */}
      <DeleteAlert
        isOpen={isDeleteAlertOpen}
        onClose={() => {setIsDeleteAlertOpen(false)}}
        _id={row.original.id}
      />
    </div>
  );
};

export default ActionCell;