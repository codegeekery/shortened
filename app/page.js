'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import React, { useState, useEffect } from 'react';
import { API_URL } from "@/utils/endpoint";
import { toast } from "@/components/ui/use-toast"
import { useSession } from "@/lib/useSession";
import { Loader } from 'lucide-react';
import { DataTable } from "@/app/(DataTable)/DataTable";
import { Columns } from "@/app/(DataTable)/Columns";
import useSWR from 'swr';

const urlSchema = z.string().url();

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
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleChange = (e) => {
    setUrl(e.target.value);
    setError(''); // Clear error message on input change
  }

  const handleShorten = async () => {
    try {
      urlSchema.parse(url); // Validate URL
      setLoading(true);
      const response = await fetch(`${API_URL}/shorter`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      switch (data.message) {
        case "Success":
          setError(''); // Clear error on successful response
          setShortenedUrl(data.shortUrl);
          toast({
            variant: 'success',
            title: 'URL shortened successfully',
            description: `URL shortened with success`,
          });
          setLoading(false);
          break;
        case "Unauthorized":
          setError('Login required for URL shortening service.');
          setLoading(false);
          break;
        case "InternalServer":
          setError('Internal Server Error');
          setLoading(false);
          break;
        default:
          setError('Error shortening URL');
          setLoading(false);
      }
    } catch (error) {
      setError('Invalid URL'); // Set error message for validation failure
      setLoading(false);
    }
  }

  const handleCopy = () => {
    console.log(shortenedUrl)
    navigator.clipboard.writeText(shortenedUrl);
    toast({
      variant: 'success',
      title: 'Copied to clipboard',
      description: `Shortened URL copied to clipboard`,
    })

    setShortenedUrl("")
    setUrl("")
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

  const { session, isLoading } = useSession();

  // Getting Data from API
  const { data } = useSWR(session?.id ? `${API_URL}/RetrieveUrls/${session.id}` : null, fetcher, {
    refreshInterval: 30000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  });

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine) {
        toast({
          variant: 'info',
          title: 'No internet connection',
          description: 'You are currently offline. Please check your internet connection.',
        });
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (isLoading) {
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
          {shortenedUrl ? (
            <React.Fragment>
              <div className="flex flex-col gap-2 items-center">
                <Button onClick={handleCopy}>Copy URL Shortened</Button>
              </div>
            </React.Fragment>
          ) : (
            <div className="flex flex-col gap-2">
              <label htmlFor="URL">Copy and paste a URL</label>
              <Input
                id="URL"
                placeholder="Enter a URL"
                className="p-4 w-[400px] outline-none"
                value={url}
                onChange={handleChange}
              />
              <Button onClick={handleShorten} className>
                {loading ? <Loader className=" animate-spin" size={20} /> : 'Shorten URL'}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          )}
        </div>

        {/* Show Table Url Shortened */}
        <div className="container my-10 p-2">
          <DataTable columns={Columns} data={data?.shortened} />
        </div>
      </div>
    </>
  );
}
