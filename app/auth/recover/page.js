'use client'
import Link from 'next/link';
import {
    Button,
} from '@/components/ui/button';
import {
    Input,
} from '@/components/ui/input';
import {
    Label
} from '@/components/ui/label';
import { API_URL } from '@/utils/endpoint';
import {
    toast
} from '@/components/ui/use-toast';
import {
    useState
} from 'react';
import {
    Loader
} from 'lucide-react';


export default function Reset() {

    // State to store the email
    const [email, setEmail] = useState('');
    // State for loading
    const [loading, setLoading] = useState(false);

    // Fetch the data from the API
    const onSubmit = async () => {
        setLoading(true);
        const response = await fetch(`${API_URL}/RecoverAuth`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();

        switch (data.message) {
            case 'Success':
                toast({
                    variant: 'success',
                    title: 'Email sent',
                    description: 'We have sent you an email to reset your password check spam or inbox',
                });
                setEmail('');
                setLoading(false);
                break;
            case 'InvalidEmail':
                toast({
                    variant: 'destructive',
                    title: 'Invalid email',
                    description: 'Please enter a valid email',
                });
                setLoading(false);
                break;
            case 'UserNotFound':
                toast({
                    variant: 'destructive',
                    title: 'User not found',
                    description: 'The user with the email provided does not exist or is not registered',
                });
                setLoading(false);
                break;
            case 'EmailRequired':
                toast({
                    variant: 'destructive',
                    title: 'Email required',
                    description: 'Please enter your email',
                });
                setLoading(false);
                break;
            default:
                toast({
                    variant: 'destructive',
                    title: 'Internal server error',
                    description: 'An error occurred while processing your request',
                });
                setLoading(false);
                break
        }
    }


    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
                <p className="mb-6 text-gray-600">
                    Enter your email address and we will send you a link to reset your password.
                </p>
                <Label htmlFor="email">Email</Label>
                <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    className="w-full mb-2 p-2 outline-none"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="w-full p-2" onClick={() => { onSubmit() }}>
                    {loading ? <Loader className="animate-spin" size={24} /> : 'Reset Password'}
                </Button>
                <div className="mt-6">
                    <Link href="/login">
                        Back to login
                    </Link>
                </div>
            </div>
            <footer className="mt-8 text-gray-600">
                &copy; 2025 shorter Url
            </footer>
        </div>
    );
}
