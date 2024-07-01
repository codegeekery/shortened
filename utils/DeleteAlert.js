import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { API_URL } from "@/utils/endpoint"
import {toast} from "@/components/ui/use-toast"



const DeleteAlert = ({ isOpen, onClose, _id }) => {

    const handleDelete = async () => {
        // Fetch DELETE request to the backend
        const response = await fetch(`${API_URL}/DeleteUrl/${_id}`, {
            credentials: 'include',
            method: 'DELETE',
        });
        // If the request was successful, close the alert
        if (response.ok) {
            toast({
                variant: 'success',
                title: 'URL deleted',
                description: `deleted with success`,
            })
            onClose();
        }
    }


    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure? you want delete <span className="text-red-500">{_id}</span>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction variant='destructive' onClick={()=>{handleDelete();}}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export { DeleteAlert }


