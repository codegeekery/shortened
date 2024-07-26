'use client'
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { API_URL } from "@/utils/endpoint"
import { toast } from "@/components/ui/use-toast"
import {
    Loader
} from 'lucide-react'

export default function Auth() {

    // state for switching between login and register
    const [isLogin, setIsLogin] = React.useState(true)
    // state for loading
    const [loading, setLoading] = React.useState(false)
    // Message error state
    const [error, setError] = React.useState([])
    // state for login
    const [LoginState, setLoginState] = React.useState({
        email: '',
        password: ''
    })
    // state for register
    const [RegisterState, setRegisterState] = React.useState({
        email: '',
        password: '',
        username: ''
    })


    const handleSwitcher = () => {
        setIsLogin((prevState) => !prevState)
        setLoginState({
            email: '',
            password: ''
        })
        setRegisterState({
            email: '',
            password: '',
            username: ''
        })

        setError([])

    }


    const handleStateSaving = (e) => {
        const { name, value } = e.target;

        if (isLogin) {
            setLoginState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else {
            setRegisterState((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

        // Clear error message on input change of the field name 
        setError({
            ...error,
            [name]: []
        })
    };

    const handleRegister = async () => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}/SignUp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(RegisterState),
            });

            const data = await response.json();

            if (response.status === 200) {
                toast({
                    variant: 'success',
                    title: 'Account Created Successfully',
                    description: `Account created successfully`,
                })
                setLoading(false)
                setRegisterState({
                    email: '',
                    password: '',
                    username: ''
                })
            } else {
                setError(data.errors)
                setLoading(false)
            }

        } catch (error) {
            console.log(error)
        }

    }

    const handleLogin = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${API_URL}/LogIn`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(LoginState),
            });

            const data = await response.json();

            switch (response.status) {
                case 200:
                    toast({
                        variant: 'success',
                        title: 'Login Successful',
                        description: `Login successful`,
                    })
                    setLoading(false)
                    setLoginState({
                        email: '',
                        password: ''
                    })
                    setInterval(()=>{
                        window.location.href = '/'
                    }, 900)
                    break;
                case 400:
                    setError(data.errors)
                    setLoading(false)
                    break;
                default:
                    setLoading(false)
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: `Internal Server Error`,
                    })
                    break;
            }
        } catch (error) {
            setLoading(false)
        }
    }



    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                {isLogin ? (
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Login</h1>
                            <p className="text-muted-foreground text-nowrap">
                                Enter your email below to login to your account
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    placeholder="m@example.com"
                                    className='outline-none p-2'
                                    name="email"
                                    value={LoginState.email}
                                    onChange={handleStateSaving}
                                    
                                />
                                {error.email && error.email.map((err, index) => (
                                    <p key={index} className='text-red-500 text-sm'>{err}</p>
                                ))}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <Link
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    className='outline-none p-2'
                                    name="password"
                                    placeholder="Password"
                                    value={LoginState.password}
                                    onChange={handleStateSaving}
                                    
                                />
                                {error.password && error.password.map((err, index) => (
                                    <p key={index} className='text-red-500 text-sm'>{err}</p>
                                ))}
                            </div>
                            <Button type="submit" className="w-full" onClick={() => { handleLogin() }}>
                                {loading ? <Loader className="animate-spin text-center" size={25} /> : 'Login'}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <span className='underline cursor-pointer' onClick={handleSwitcher}>
                                Sign Up
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Sign Up</h1>
                            <p className="text-balance text-muted-foreground">
                                Enter your email below to create an account
                            </p>
                        </div>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    placeholder="john@domain.com"
                                    className='outline-none p-2'
                                    value={RegisterState.email}
                                    onChange={handleStateSaving}
                                />
                                {error.email && error.email.map((err, index) => (
                                    <p key={index} className='text-red-500 text-sm'>{err}</p>
                                ))}
                            </div>
                            <div>
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    className='outline-none p-2'
                                    value={RegisterState.username}
                                    onChange={handleStateSaving}
                                />
                                {error.username && error.username.map((err, index) => (
                                    <p key={index} className='text-red-500 text-sm'>{err}</p>

                                ))}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className='outline-none p-2'
                                    name="password"
                                    placeholder="Password"
                                    value={RegisterState.password}
                                    onChange={handleStateSaving}
                                />
                                {error.password && error.password.map((err, index) => (
                                    <p key={index} className='text-red-500 text-sm'>{err}</p>
                                ))}
                            </div>
                            <Button type="button" className="w-full flex items-center" onClick={() => { handleRegister() }}>
                                {loading ? <Loader className="animate-spin text-center" size={25} /> : 'Sign Up'}
                            </Button>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <span className='underline cursor-pointer' onClick={handleSwitcher}>
                                Log in
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div className="hidden bg-muted lg:block">
                <Image
                    src="/authPortal.jpg"
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    )
}
