import { createContext, useContext, useCallback, useEffect, useState } from "react";
import { UseMutateFunction, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SignUpData } from "@/pages/auth/SignUp";

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
      mutate: UseMutateFunction<any, Error, void, unknown>;
      isLoading: boolean;
      error: Error | null;
    };
    signOut: () => void;
    // requestPasswordReset: {
    //   mutate: UseMutateFunction<any, Error, void, unknown>;
    //   isLoading: boolean;
    //   error: Error | null;
    // };
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
        const storedToken = localStorage.getItem("token");
        if (storedToken && storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const signUp = useMutation<any, Error, SignUpData>({
    mutationFn: async (userData) => {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Sign-up failed");
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.message || "Sign-up failed.");
    },
  });

  const signIn = useMutation({
    mutationFn: async (credentials) => {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!response.ok) throw new Error("Invalid credentials");
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Signed in successfully.");
      navigate("/dashboard");
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

  // const requestPasswordReset = useMutation({
  //   mutationFn: async (email) => {
  //     const response = await fetch("/api/auth/password-reset", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ email }),
  //     });
  //     if (!response.ok) throw new Error("Password reset failed");
  //     return response.json();
  //   },
  //   onSuccess: () => {
  //     toast.success("Password reset email sent.");
  //     navigate("/auth/sign-in");
  //   },
  //   onError: (error) => {
  //     toast.error(error.message || "Password reset failed.");
  //   },
  // });

  const getToken = useCallback(() => localStorage.getItem("token"), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signUp: { mutate: signUp.mutate, isLoading: signUp.isPending, error: signUp.error },
        signIn: { mutate: signIn.mutate, isLoading: signIn.isPending, error: signIn.error },
        signOut,
        // requestPasswordReset: { mutate: requestPasswordReset.mutate, isLoading: requestPasswordReset.isPending, error: requestPasswordReset.error },
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
