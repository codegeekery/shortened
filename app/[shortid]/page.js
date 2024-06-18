'use client'
import { redirect } from "next/navigation"
import useSWR from "swr"
import { API_URL } from "@/utils/endpoint"
import { useParams } from "next/navigation"
import {
    Loader
} from 'lucide-react'

const fetcher = (...args) => fetch(...args).then(res => res.json())

export default function Page() {
    const { shortid } = useParams()
    const { data, isLoading } = useSWR(`${API_URL}/GetShorter/${shortid}`, fetcher)

    if (isLoading) return (
        <>
            <div className="flex justify-center items-center h-screen">
                <Loader size={32} />
            </div>
        </>
    )

    redirect(data?.id)
}