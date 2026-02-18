"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/user.schema";
import { api, extractErrorMessage } from "@/lib/api-client";

type SignUpFormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);

  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (!username || username.length < 4) {
        setUsernameMessage("");
        setIsUsernameAvailable(null);
        return;
      }
      setIsCheckingUsername(true);
      try {
        const response = await api.users.checkUsername(username);
        setUsernameMessage(response.message);
        setIsUsernameAvailable(response.success);
      } catch (error) {
        setUsernameMessage(extractErrorMessage(error));
        setIsUsernameAvailable(false);
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.users.signUp(data.username, data.email, data.password);
      toast({ title: "Success", description: response.message });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign up to start receiving anonymous messages
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <Input
                    placeholder="your_username"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      debounced(e.target.value);
                    }}
                  />
                  {isCheckingUsername && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!isCheckingUsername && usernameMessage && (
                    <p className={`flex items-center gap-1 text-sm ${isUsernameAvailable ? "text-green-600" : "text-destructive"}`}>
                      {isUsernameAvailable ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input placeholder="you@example.com" type="email" {...field} />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll send you a verification code.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <Input placeholder="Min. 6 characters" type="password" {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
