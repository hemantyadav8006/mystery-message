"use client";

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
import { api, extractErrorMessage } from "@/lib/api-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  verifyCode: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

type VerifyFormValues = z.infer<typeof formSchema>;

export default function VerifyAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { verifyCode: "" },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await api.users.verifyCode(params.username, data.verifyCode);
      toast({ title: "Success", description: response.message });
      router.replace("/sign-in");
    } catch (error) {
      toast({
        title: "Verification Failed",
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
            Verify Your Account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="verifyCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input
                    placeholder="123456"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                    {...field}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</>
              ) : (
                "Verify Account"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
