'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { useState } from 'react';
import { API_URL } from "@/utils/endpoint";
import { toast } from "@/components/ui/use-toast"
import {
    Loader
} from 'lucide-react'

const urlSchema = z.string().url();

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (response.ok) {
        setError(''); // Clear error on successful response
        setShortenedUrl(data.shortUrl);
        toast({
          variant: 'success',
          title: 'URL shortened successfully',
          description: `URL shortened with success`,
        })
        setLoading(false);
      } else {
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

  return (
    <>
      <div className="flex justify-center items-center h-screen">
        {shortenedUrl ? (
          <div className="flex flex-col gap-2 items-center">
            <Button onClick={handleCopy}>Copy URL Shortened</Button>
          </div>
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
    </>
  );
}
