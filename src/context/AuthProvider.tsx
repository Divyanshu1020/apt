import { API_BASE_URL } from "@/constant";
import { SignUpData } from "@/pages/auth/SignUp";
import {
  UseMutateFunction,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface User {
  id: number;
  email: string;
  name: string;
  password: string;
  enabled: boolean;
  roles: string[];
}
interface AuthContextValue {
  user: any;
  setUser: (user: any) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: {
    mutate: UseMutateFunction<any, Error, SignUpData, unknown>;
    isLoading: boolean;
    error: Error | null;
  };
  signIn: {
    mutate: UseMutateFunction<
      any,
      Error,
      { email: string; password: string },
      unknown
    >;
    isLoading: boolean;
    error: Error | null;
  };
  signOut: () => void;
  requestPasswordReset: {
    mutate: UseMutateFunction<any, Error, { email: string }, unknown>;
    isLoading: boolean;
    error: Error | null;
  };
  verifyForgotPasswordCode: {
    mutate: UseMutateFunction<
      any,
      Error,
      { email: string; otp: string },
      unknown
    >;
    isLoading: boolean;
    error: Error | null;
  };
  verifySignInCode: {
    mutate: UseMutateFunction<
      any,
      Error,
      { email: string; otp: string },
      unknown
    >;
    isLoading: boolean;
    error: Error | null;
  };
  newPassword: {
    mutate: UseMutateFunction<any, Error, { newPassword: string }, unknown>;
    isLoading: boolean;
    error: Error | null;
  };
  getToken: () => string | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("access-token");
        const refreshToken = localStorage.getItem("refresh-token");

        if (accessToken && refreshToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("access-token");
        localStorage.removeItem("refresh-token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const signUp = useMutation<any, Error, SignUpData>({
    mutationFn: async (userData) => {
      const response = await fetch(`${API_BASE_URL}/v1/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Account created successfully.");
      navigate("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(error.message || "Sign-up failed.");
    },
  });

  const signIn = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await fetch(`${API_BASE_URL}/v1/login-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      return response.json();
    },
    onSuccess: (data, { email }) => {
      localStorage.setItem("temp-token", data.data.temp_token);
      
      
      navigate(`/auth/verify-code?email=${email}&codeType=verifySignIn`);

    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials.");
    },
  });

  const signOut = useCallback(() => {
    localStorage.removeItem("temp-token");
    localStorage.removeItem("access-token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("user");
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate("/auth/sign-in");
    toast.success("Signed out successfully.");
  }, [navigate, queryClient]);

  const requestPasswordReset = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch(`${API_BASE_URL}/v1/login-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Password reset failed");
      return response.json();
    },
    onSuccess: (_, { email }) => {
      toast.success("OTP has been sent to your email.");
      navigate("/auth/verify-code?email=" + email);
    },
    onError: (error) => {
      toast.error(error.message || "OTP generation failed.");
    },
  });

  const verifyForgotPasswordCode = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      localStorage.removeItem("reset_password_token");
      const response = await fetch(
        `${API_BASE_URL}/v1/forgot-password-verify-email-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("OTP verified successfully.");
      console.log("OTP verified successfully:", data);
      localStorage.setItem(
        "reset_password_token",
        data.data.reset_password_token
      );
      navigate("/auth/new-password");
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed.");
    },
  });

  const verifySignInCode = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      const response = await fetch(
        `${API_BASE_URL}/v1/authenticator-validate-code`,
        {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("temp-token") || ""}`,
          },
          body: JSON.stringify({ email, code: otp }),

        }
      );
      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Sign-in successful.");

      // Store the new access token
      localStorage.setItem("access-token", data.data.accessToken);
      localStorage.setItem("refresh-token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setUser(data.data.user);

      const userRoles = data.data.user?.roles || [];
      const haveRoles = userRoles.length > 0;
      const redirectTo = haveRoles ? "/auth/role-selection" : "/";

      navigate(redirectTo);
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed.");
    },
  });

  const newPassword = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const reset_password_token =
        localStorage.getItem("reset_password_token") || "";
      const response = await fetch(
        `${API_BASE_URL}/v1/forgot-password-reset-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${reset_password_token}`,
          },
          body: JSON.stringify({
            password: newPassword,
            reset_password_token,
          }),
        }
      );
      if (!response.ok) throw new Error("Password reset failed");
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("Password reset successfully.");

      localStorage.setItem("access-token", data.data.accessToken);
      localStorage.setItem("refresh-token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      localStorage.removeItem("reset_password_token");

      setUser(data.data.user);

      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Password reset failed.");
      localStorage.removeItem("reset_password_token");
      navigate("/auth/sign-in");
    },
  });

  const renewAccessToken = useMutation({
    mutationFn: async ({ refreshToken }: { refreshToken: string }) => {
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${API_BASE_URL}/v1/renew-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (!response.ok) throw new Error("Failed to renew access token");
      return response.json();
    },
    onSuccess: (data) => {
      // Store the new access token
      localStorage.setItem("access-token", data.data.accessToken);
      localStorage.setItem("refresh-token", data.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      setUser(data.data.user);

      const userRoles = data.data.user?.roles || [];
      const haveRoles = userRoles.length > 0;
      const redirectTo = haveRoles ? "/auth/role-selection" : "/";

      navigate(redirectTo);
    },
    onError: () => {
      toast.error("Failed to get access token. Please try logging in again.");
      navigate("/auth/sign-in");
    },
  });

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        isLoading,
        signUp: {
          mutate: signUp.mutate,
          isLoading: signUp.isPending,
          error: signUp.error,
        },
        signIn: {
          mutate: signIn.mutate,
          isLoading: signIn.isPending,
          error: signIn.error,
        },
        signOut,
        requestPasswordReset: {
          mutate: requestPasswordReset.mutate,
          isLoading: requestPasswordReset.isPending,
          error: requestPasswordReset.error,
        },
        verifyForgotPasswordCode: {
          mutate: verifyForgotPasswordCode.mutate,
          isLoading: verifyForgotPasswordCode.isPending,
          error: verifyForgotPasswordCode.error,
        },
        verifySignInCode: {
          mutate: verifySignInCode.mutate,
          isLoading: verifySignInCode.isPending,
          error: verifySignInCode.error,  
        },
        newPassword: {
          mutate: newPassword.mutate,
          isLoading: newPassword.isPending,
          error: newPassword.error,
        },
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
