import useSWR from "swr";
import { API_URL } from "@/utils/endpoint";


// fetcher with credentials
const fetcher = (url) => fetch(url, { credentials: 'include' }).then((res) => res.json());

export const useSession = () => {

    const { data } = useSWR(`${API_URL}/GetSession`, fetcher, {refreshInterval: 5000});

    const session = data?.session;
    

    return {
        session: session,
        isLoading: !data,
    };
}