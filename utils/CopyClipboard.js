import { toast } from "@/components/ui/use-toast"

const CopyClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast({
                    variant: 'success',
                    title: 'Copied!',
                    description: 'Text copied to clipboard!',
                });
            })
            .catch((err) => {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Failed to copy text to clipboard!',
                });
            });
    } else {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Clipboard API not available!',
        });
    }
};

export { CopyClipboard }