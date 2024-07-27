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
import { toast } from "@/components/ui/use-toast"

import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

const DeleteAlert = ({ isOpen, onClose, _id, onSuccess }) => {

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationKey: 'shortenedUrls', // Clave única para identificar esta mutación
    mutationFn: async () => {
      const response = await fetch(`${API_URL}/DeleteUrl`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id }),
      });
      if (response.ok) {
        toast({
          variant: 'success',
          title: 'URL deleted',
          description: `Successfully deleted ${_id.length} items.`,
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
    onSuccess: async (data) => {
      // Actualiza la caché después de eliminar la URL
      queryClient.invalidateQueries(['shortenedUrls']);
      onSuccess()
      onClose();
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete items.',
      });
    },
  });


  return (
    <>
      <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you absolutely sure? you want delete <span className="text-red-500">{_id.length} items</span>
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={() => { deleteMutation.mutate() }}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  )
}

export { DeleteAlert }


