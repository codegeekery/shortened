'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/endpoint';
import { useParams } from 'next/navigation';
import {
    useQuery,
} from '@tanstack/react-query';

// Fetcher function to be used with SWR
const fetcher = (...args) => fetch(...args).then(res => res.json());

export default function Page() {
    const { shortid } = useParams();
    const router = useRouter();
    // const { data, error } = useSWR(`${API_URL}/GetShorter/${shortid}`, fetcher, { revalidateOnFocus: false });
    const { data, error } = useQuery({
        queryKey: ['GetShorter'],
        queryFn: () => fetcher(`${API_URL}/GetShorter/${shortid}`),
    });

    useEffect(() => {
        if (data) {
            if (data.id) {
                // Use router.replace to prevent adding a new entry to the browser history
                router.replace(data.id);
            } else {
                // Redirect to home if there's no valid redirect URL
                router.replace('/');
            }
        } else if (error) {
            // Redirect to home in case of an error
            router.replace('/');
        }
    }, [data, error, router]);

    // Return null since useEffect handles the redirection.
    return null;
}
