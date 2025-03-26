import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthProvider";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function NewPassword() {
  const { newPassword } = useAuth();
  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onBlur",
  });

  const onSubmit = (data: { newPassword: string; confirmPassword: string }) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    newPassword.mutate({ newPassword: data.newPassword });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Set New Password</CardTitle>
          <CardDescription>
            Enter your new password to reset your account password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="newPassword"
                rules={{
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/,
                    message:
                      "Password must contain at least one lowercase letter, one uppercase letter, one number and one special character",
                  },
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === form.getValues("newPassword") ||
                    "Passwords do not match",
                }}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={newPassword.isLoading}
              >
                {newPassword.isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={18} />{" "}
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <Link to="/auth/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
