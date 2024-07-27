'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from 'react';
import { API_URL } from "@/utils/endpoint";
import { toast } from "@/components/ui/use-toast"
import { useSession } from "@/lib/useSession";
import { Loader } from 'lucide-react';
import { DataTable } from "@/app/(DataTable)/DataTable";
import { Columns } from "@/app/(DataTable)/Columns";

// TESTING TANSTACK QUERY
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';



const fetcher = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Tanstack Query
  const queryClient = useQueryClient()

  // Save URL in the URL State
  const handleChange = (e) => {
    setUrl(e.target.value);
    setError(''); // Clear error message on input change
  }

  // LogOut Function
  const handleLogOut = async () => {
    try {
      const response = await fetch(`${API_URL}/LogOut`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      switch (response.status) {
        case 200:
          toast({
            variant: 'success',
            title: 'Logged out',
            description: `${data.message}`
          })
          window.location.reload();
          break;
        case 500:
          toast({
            variant: 'error',
            title: 'Error',
            description: `Internal Server Error`,
          })
          break;
        default:
          toast({
            variant: 'error',
            title: 'Error',
            description: `An error occurred`,
          })
      }

    } catch (error) {
      toast({
        variant: 'error',
        title: 'Error',
        description: 'An error occurred during logout',
      })
    }
  }

  // Hook to get the session from the server of the user
  const { session, isLoading } = useSession();


  // Tanstack Query Get All users URLS Table
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ['shortenedUrl'],
    queryFn: () => fetcher(session?.id ? `${API_URL}/RetrieveUrls/${session.id}` : ''),
    enabled: !!session?.id,
    refetchInterval: 60 * 1000,
  });

  // Tanstack Query Create Shortened URL
  const createShortenedUrl = useMutation({
    mutationKey: 'shortenedUrl',
    mutationFn: async (url) => {
      setLoading(true);
      const response = await fetch(`${API_URL}/shorter`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      return await response.json();
    },
    onSuccess: (data) => {
      switch (data.message) {
        case "Success":
          setError(''); // Clear error on successful response
          toast({
            variant: 'success',
            title: 'URL shortened successfully',
            description: `URL shortened with success`,
          });
          setLoading(false);
          setUrl(''); // Clear input after successful response
          queryClient.invalidateQueries('shortenedUrls'); // Invalidate the query to refetch the data
          break;
        case "Unauthorized":
          setError('Login required for URL shortening service.');
          setLoading(false);
          break;
        case "InternalServer":
          setError('Internal Server Error');
          setLoading(false);
          break;
        case "UrlsInvalid":
          setError('Invalid URL');
          setLoading(false);
          break;
        default:
          setError('Error shortening URL');
          setLoading(false);
      }
    },
    onError: (error) => {
      //Captura el mensaje de error desde la mutación
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Internal Server Error',
      })
      setLoading(false);
    },
  });


  if (isLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" size={24} />
      </div>
    )
  }

  return (
    <>
      {session ? (
        <div className="flex items-center gap-4 justify-end p-2">
          <p className="text-black">{`Welcome ${session?.username}`}</p>
          <Button onClick={() => { handleLogOut() }} variant='destructive' className="w-[140px]">Logout</Button>
        </div>
      ) : (
        <div className="flex justify-end p-2">
          <a href="/auth" className="text-blue-500">
            <Button className="w-[140px]">Log In</Button>
          </a>
        </div>
      )}

      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <div className="flex flex-col gap-2">
            <label htmlFor="URL">Paste the URL to be shortened</label>
            <Input
              id="URL"
              placeholder="Enter a URL"
              className="p-4 w-[400px] outline-none"
              value={url}
              onChange={handleChange}
            />
            <Button
              onClick={() => {createShortenedUrl.mutate(url)}}
              disabled={loading}
            >
              {loading ? <Loader className=" animate-spin" size={20} /> : 'Shorten URL'}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>

        {/* Show Table Url Shortened */}
        <div className="container my-10 p-2">
          <DataTable columns={Columns} data={data?.shortened} />
        </div>
      </div>
    </>
  );
}
