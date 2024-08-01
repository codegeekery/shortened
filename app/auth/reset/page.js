// pages/reset-password.js
'use client'
import { useState } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useSearchParams } from 'next/navigation';
import { API_URL } from '@/utils/endpoint';
import {
    Button,
} from '@/components/ui/button';



export default function Reset() {

    const search = useSearchParams();


    const [password, setPassword] = useState('');

    const onSubmit = async () => {
        const response = await fetch(`${API_URL}/ResetPassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${search.get('payload')}`,
            },
            body: JSON.stringify({ password }),
        });

        const data = await response.json();

        switch (data.message) {
            case 'Success':
                toast({
                    variant: 'success',
                    title: 'Password Reset',
                    description: 'Your password has been reset successfully',
                });
                setPassword('');
                break;
            case 'PasswordRequired':
                toast({
                    variant: 'destructive',
                    title: 'Password Required',
                    description: 'Please enter a password',
                });
                break;
            case 'TokenRequired':
                toast({
                    variant: 'destructive',
                    title: 'Token Required',
                    description: 'Please provide a token',
                });
                break;
            case 'TokenInvalid':
                toast({
                    variant: 'destructive',
                    title: 'Error Token',
                    description: 'The token is invalid or expired',
                });
                break;
            default:
                toast({
                    variant: 'destructive',
                    title: 'Error Server',
                    description: 'Server Internal Error',
                });
                break;
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <Button onClick={() => { onSubmit() }} className="w-full">
                            Reset Password
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
