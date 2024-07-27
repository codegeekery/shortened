// import useSWR from "swr";
import { API_URL } from "@/utils/endpoint";
// Tanstack Query
import { useQuery } from '@tanstack/react-query';


// fetcher with credentials
const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export const useSession = () => {

    const { data } = useQuery({
        queryKey: ['GetSession'],
        queryFn: () => fetcher(`${API_URL}/GetSession`),
        refetchInterval: 30 * 1000,
    });

    const session = data?.session;


    return {
        session: session,
        isLoading: !data,
    };
}