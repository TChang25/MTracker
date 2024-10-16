"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider"
import { useEffect } from "react"

const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    })
});

function Login() {
    const { login, loading, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            // Redirect to dashboard if the user is already logged in
            navigate('/Dashboard');
        }
    }, [isAuthenticated, navigate]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            username: "",
            password: ""
        },
    })
    async function authenticate(){
        
        const endpoint = '/api/verify';
        const baseUrl = window.location.href.split('/').slice(0, -1).join('/'); 
        let url = baseUrl + endpoint

        try {
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            console.log('Authenticating token..')
            console.log(data);

        } catch (error) {
            console.error('Failed to Sign in:', error);
            throw error; // Optionally re-throw or handle the error
        }
    }
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            console.log('Attempting sign-in')
            await login(values.username, values.password);
            console.log('Log in successful!')
            console.log('Attempting authentication')
            await authenticate()
            console.log('Authentication Success!')
        } catch (err) {
            console.log(err + 'Login failed. Please try again.');
        }

    }

    return (
    <>
        <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
                <img width={100} src='..\book-heart.svg'></img>
                <h1>  Sign in to your account </h1>
            </div>

            <Card className="m-10" style={{width: 400}}>
                <CardContent className="m-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="Username" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input className=" min-w-100" type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            
                            <Button className="min-w-full" type="submit" disabled={loading}> {loading ? 'Signing in...' : 'Sign in'}</Button>
                        </form>
                    </Form>
                    <NavLink to="/Register" className="text-sm font-medium leading-none cursor-pointer select-none"> Don't have an account?</NavLink>
                </CardContent>
            </Card>



            
        </div>
    </>
    
    
  )
}
export default Login
