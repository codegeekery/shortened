import { Button } from "@/components/ui/button"
import React from "react"
import { DeleteAlert } from "@/utils/DeleteAlert" // Asegúrate de importar el componente correcto

const BulkActionCell = ({ selectedRowIds, onSuccess }) => {
    const [isDeleteEnabled, setIsDeleteEnabled] = React.useState(false)
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = React.useState(false)

    // Update the delete button state when the selected row ids change  
    React.useEffect(() => {
        setIsDeleteEnabled(selectedRowIds.length > 0)
    }, [selectedRowIds])



    return (
        <div className="flex items-center gap-2">
            <Button
                variant={isDeleteEnabled ? "destructive" : ""}
                onClick={() => {setIsDeleteAlertOpen(true)}}
                disabled={!isDeleteEnabled}
            >
                Delete {selectedRowIds.length} items
            </Button>
            <DeleteAlert
                isOpen={isDeleteAlertOpen}
                onClose={() => setIsDeleteAlertOpen(false)}
                _id={selectedRowIds}
                onSuccess={onSuccess}
            />
            
        </div>
    )
}

export default BulkActionCell