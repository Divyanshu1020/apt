import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuth } from "@/context/AuthProvider";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react"; // Import loader icon
import React from "react";

export default function VerifyCode() {
  const { verifyForgotPasswordCode, verifySignInCode } = useAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const codeType = searchParams.get("codeType") || "";
  const form = useForm({
    defaultValues: {
      otp: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = (data: { otp: string }) => {
    if (data.otp.length < 6) {
      form.setError("otp", {
        type: "manual",
        message: "Code should be 6 characters long",
      });
      return;
    }

    if(codeType === "resetPassword") {
      verifyForgotPasswordCode.mutate({ otp: data.otp, email });
      return;
    }

    if(codeType === "verifySignIn") {
      verifySignInCode.mutate({ otp: data.otp, email });
      return;
    }
  
  };

  // const resend = () => {
  //   requestPasswordReset.mutate({ email: email });
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Verify Code</CardTitle>
              <CardDescription>
                Enter 6 digit code from Aptamitra Authenticator App
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <FormField
                  control={form.control}
                  name="otp"
                  rules={{ required: "Code is required" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP maxLength={6} {...field}>
                          <InputOTPGroup className="gap-[5px]">
                            {[...Array(6)].map((_, index) => (
                              <React.Fragment key={index}>
                                <InputOTPSlot index={index} className="border" />
                                {index < 5 && <InputOTPSeparator />}
                              </React.Fragment>
                            ))}
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full flex items-center justify-center"
                disabled={verifySignInCode.isLoading || verifyForgotPasswordCode.isLoading} // Disable button while loading
              >
                {verifySignInCode.isLoading || verifyForgotPasswordCode.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} /> Verifying...
                  </>
                ) : (
                  "Verify Code"
                )}
              </Button>
              {/* <p className="text-sm text-gray-600">
                Didn't receive a code?{" "}
                <button
                  className="text-primary hover:underline"
                  disabled={verifyCode.isLoading || requestPasswordReset.isLoading} // Disable while loading
                  onClick={resend}
                >
                  {requestPasswordReset.isLoading ? "Sending"  : "Resend"}
                </button>
              </p> */}
              <Link
                to="/auth/sign-in"
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
