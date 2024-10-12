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
import { NavLink } from "react-router-dom";

const formSchema = z.object({
    first_name: z.string().min(1, {
        message: "First Name must not be empty."
    }),
    last_name: z.string().min(1, {
        message: "Last Name must not be empty."
    }),
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string().min(1, {
        message: "Confirm Password must not be empty.",
    }),
    email: z.string().email({
        message: "Must be a valid email address.",
    }).min(0, {
        message: "Email must not be empty.",
    })
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"], // path of error
    });


function Register() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
            defaultValues: {
            first_name: "",
            last_name: "",
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })


    async function onSubmit(values: z.infer<typeof formSchema>) {
        let url = 'http://127.0.0.1:8888/api/register';
        console.log(url);
        try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data; // Handle your response data as needed

        } catch (error) {
        console.error('Failed to Sign in:', error);
        throw error; // Optionally re-throw or handle the error
        }
        console.log(values)
    }


    return (
    <>
        <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
                <img width={100} src='..\book-heart.svg'></img>
                <h1>  Register your account </h1>
            </div>

            <Card className="m-10" style={{width: 400}}>
                <CardContent className="m-5">
                    <Form {...form}>
                        <form  onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="first_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="First Name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />



                            <FormField
                            control={form.control}
                            name="last_name"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Last Name" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />



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

                            <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input className=" min-w-100" type="password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            <Button className="min-w-full" type="submit">Register</Button>
                        </form>
                    </Form>
                    <NavLink to="/Login" className="text-sm font-medium leading-none cursor-pointer select-none"> Don't have an account?</NavLink>
                </CardContent>
            </Card>



            
        </div>
    </>
    
    
  )
}
export default Register
