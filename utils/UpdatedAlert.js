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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const UpdatedAlert = ({ isOpen, onClose, _id, currentText }) => {
    const [text, setText] = useState(currentText);
    const queryClient = useQueryClient();

    const handleReset = () => {
        setText('');
    }

    const updateMutation = useMutation({
        mutationKey: ['shortenedUrls'], // Clave única para identificar esta mutación
        mutationFn: async () => {
            const response = await fetch(`${API_URL}/UpdatedUrl`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ _id, text }),
            });
            switch (response.status) {
                case 200:
                    toast({
                        variant: 'success',
                        title: 'URL updated',
                        description: `Successfully updated ${_id.length} items.`,
                    });
                    return response.json();
                case 401:
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Unauthorized',
                    })
                    break;
                case 400:
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Invalid URL',
                    })
                    break;
                default:
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: 'Internal Server Error.',
                    })
            }
        },
        onSuccess: async (data) => {
            // Actualiza la caché después de actualizar la URL
            queryClient.invalidateQueries(['shortenedUrls']);
            onClose();
            handleReset();
        },
        onError: (error) => {
            // console.log(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to update URL.',
            });
        },
    });

    return (
        <>
            <AlertDialog open={isOpen} onOpenChange={onClose}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit URL</AlertDialogTitle>
                        <AlertDialogDescription>
                            Modify the text field for the URL and save the changes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="p-4">
                        <input
                            type="text"
                            value={text}
                            name="text"
                            onChange={(e) => setText(e.target.value)}
                            className="border p-2 w-full outline-none borde border-white shadow-md rounded-md"
                            placeholder="Enter new url text"
                        />
                    </div>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                handleReset();
                            }}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            variant='primary'
                            onClick={() => { updateMutation.mutate() }}
                        >
                            Save Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export { UpdatedAlert }
