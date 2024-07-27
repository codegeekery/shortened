'use client'
// Import Endpoint
import { API_URL, HOME } from "@/utils/endpoint";
// Import useState
import React, { useState, useEffect } from "react";
// Import zodResolver
import { zodResolver } from "@hookform/resolvers/zod"
// Import useForm
import { useForm } from "react-hook-form"
// Import z from zod
import { z } from "zod"
// Import Button the component Button Shadcn ui
import { Button } from "@/components/ui/button"
// Import Form
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
// Import InputOTP the component InputOTP Shadcn ui
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast";
import { useSearchParams} from "next/navigation";



const FormSchema = z.object({
    OTP: z.string().min(6, {
        message: "Your Code must be 8 Numbers.",
    }),
})


export default function Page() {

    const searchParams = useSearchParams();

    const Payload = searchParams.get('payload');


    const [Loading, setLoading] = useState(false);


    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            OTP: "",
        },
    })

    async function onSubmit(code) {

        setLoading(true); // Cambiar el estado de carga a verdadero
        const response = await fetch(`${API_URL}/Verified`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Verification: code.OTP })
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                // Components 
                setLoading(false);
                toast({ variant: "success", title: "Your account has been verified successfully", description: data.message });
                window.location.href = `${HOME}/auth`;
                break;
            case 400:
                // Components 
                setLoading(false);
                toast({ variant: "destructive", title: "Error verifying OTP", description: data.error });
                break;
            default:
                // Components 
                setLoading(false);
                toast({ variant: "destructive", title: "Error verifying OTP", description: "Something went wrong" });
                break;
        }
    }

    // Resend the OTP
    const [disabled, setDisabled] = useState(true);
    const [countdown, setCountdown] = useState(120); // 2 minutos en segundos

    useEffect(() => {
        let timer;
        if (disabled) {
            timer = setTimeout(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
                if (countdown <= 0) {
                    setDisabled(false); // Habilita el botón al llegar a 0
                }
            }, 1000); // Actualiza cada segundo
        }
        return () => clearTimeout(timer); // Limpiar el temporizador al desmontar el componente
    }, [disabled, countdown]);

    const ResendOTP = async () => {
        setDisabled(true); // Desactiva el botón al hacer clic
        setCountdown(120); // Reinicia el temporizador

        const response = await fetch(`${API_URL}/ResendOTP`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ payload: Payload })
        });

        const data = await response.json();

        switch (response.status) {
            case 200:
                // Components 
                toast({ variant: "success", title: "Resend email successfully", description: data.message });
                break;
            case 400:
                // Components 
                toast({ variant: "destructive", title: "Error", description: data.error });
                break;

            case 401:
                // Components 
                toast({ variant: "destructive", title: "Invalid or expired token", description: data.error });
                break;
            default:
                // Components 
                toast({ variant: "destructive", title: "Error sending code", description: "Something went wrong" });
                break;
        }
    };




    return (
        <>
            <div className="relative font-inter antialiased">
                <main className="relative min-h-screen flex flex-col justify-center bg-slate-50 overflow-hidden">
                    <div className="w-full max-w-6xl mx-auto px-4 md:px-6 py-24">
                        <div className="flex justify-center">

                            <div className="max-w-md mx-auto text-center bg-white px-4 sm:px-8 py-10 rounded-xl shadow">
                                <header className="mb-8">
                                    <h1 className="text-2xl font-bold mb-1">Email Verification</h1>
                                    <p className="text-sm text-slate-500">Enter the 4-digit verification code that was sent to your email.</p>
                                </header>

                                <div className="flex justify-center">
                                    <Form {...form}>
                                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 items-center">
                                            <div>
                                                <FormField
                                                    control={form.control}
                                                    name="OTP"
                                                    render={({ field }) => (
                                                        <FormItem className='flex flex-col justify-center mb-4'>
                                                            <FormControl>
                                                                <InputOTP maxLength={6} {...field}>
                                                                    <InputOTPGroup>
                                                                        <InputOTPSlot index={0} />
                                                                        <InputOTPSlot index={1} />
                                                                        <InputOTPSlot index={2} />
                                                                        <InputOTPSlot index={3} />
                                                                        <InputOTPSlot index={4} />
                                                                        <InputOTPSlot index={5} />
                                                                    </InputOTPGroup>
                                                                </InputOTP>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button className='w-full' type="submit">
                                                {Loading ? "Loading..." : "Verify"}
                                            </Button>
                                        </form>
                                    </Form>
                                </div>
                                <div
                                    className="text-sm text-slate-500 mt-4">
                                    Didn&apos;t receive code?
                                    <Button variant='ghost' onClick={() => { ResendOTP(); }}>
                                        {disabled ? `Resend Code (${Math.floor(countdown / 60)}:${countdown % 60})` : 'Resend Code'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

        </>
    )
}