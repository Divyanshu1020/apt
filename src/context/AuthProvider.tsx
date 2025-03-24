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
  verifyCode: {
    mutate: UseMutateFunction<any, Error,  { email: string; otp: string }, unknown>;
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
      navigate("/");
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
    onSuccess: (data) => {
      localStorage.setItem("temp-token", data.data.temp_token);
      localStorage.setItem("user", JSON.stringify(data.data.user || "No data"));
      setUser(data.user);
      // Call the renewAccessToken function after successful login
      renewAccessToken.mutate({
        refreshToken: data.data.temp_token,
      });
      toast.success("Signed in successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials.");
    },
  });

  const signOut = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    queryClient.invalidateQueries({ queryKey: ["user"] });
    navigate("/auth/sign-in");
    toast.success("Signed out successfully.");
  }, [navigate, queryClient]);

  const requestPasswordReset = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await fetch(
        `${API_BASE_URL}/v1/login-email-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
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

  const verifyCode = useMutation({
    mutationFn: async ({ email,otp }: { email: string; otp: string }) => {
      const response = await fetch(
        `${API_BASE_URL}/v1/forgot-password-verify-email-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        }
      );
      if (!response.ok) {
        const res = await response.json()
        throw new Error(res.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      toast.success("OTP verified successfully.");
      console.log("OTP verified successfully:", data);
      // navigate("/auth/new-password");
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed.");
    },
  });

  const newPassword = useMutation({
    mutationFn: async ({ newPassword }: { newPassword: string }) => {
      const reset_password_token = localStorage.getItem("reset_password_token") || "";
      const response = await fetch(
        `${API_BASE_URL}/v1/authenticator-generate-code`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            password : newPassword,
            reset_password_token
           }),
        }
      );
      if (!response.ok) throw new Error("Password reset failed");
      return response.json();
    },
    onSuccess: () => {
      navigate("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(error.message || "Password reset failed.");
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

      navigate("/");
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
        verifyCode: {
          mutate: verifyCode.mutate,
          isLoading: verifyCode.isPending,
          error: verifyCode.error,
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
