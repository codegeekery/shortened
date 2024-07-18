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

import {
    useMutation,
    useQueryClient,
  } from '@tanstack/react-query'

const DeleteAlert = ({ isOpen, onClose, _id }) => {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationKey: 'shortenedUrls', // Clave única para identificar esta mutación
        mutationFn: async () => {
          const response = await fetch(`${API_URL}/DeleteUrl/${_id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (response.ok) {
            toast({
              variant: 'success',
              title: 'URL deleted',
              description: 'URL deleted successfully.',
            });
            return response.json();
          } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete URL.',
             })
          }
        },
        onSuccess: (data) => {
          // Actualiza la caché después de eliminar la URL
          queryClient.invalidateQueries(['shortenedUrls']);
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to delete URL.',
          });
        },
      });


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
                        <AlertDialogAction variant='destructive' onClick={()=>{deleteMutation.mutate()}}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    )
}

export { DeleteAlert }


