import { API_BASE_URL } from "@/constant";
import { useCSRF } from "@/hooks/csrf-token";
import { SignUpData } from "@/pages/auth/SignUp";
import {
  UseMutateFunction,
  useMutation,
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
  logout: {
    mutate: UseMutateFunction<any, Error, void, unknown>;
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
  const { fetchCSRFToken } = useCSRF();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth status check failed:", error);
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  const signUp = useMutation<any, Error, SignUpData>({
    mutationFn: async (userData) => {
      try {
        const csrfToken = await fetchCSRFToken(); 
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        console.log("csrfToken", csrfToken);

        const response = await fetch(`${API_BASE_URL}/v1/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(userData),
          credentials: "include",
        });

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message);
        }
        return response.json();
      } catch (error) {
        console.error("Sign-up error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success(data.message || "Sign-up successful.");
      navigate("/auth/sign-in");
    },
    onError: (error) => {
      toast.error(error.message || "Sign-up failed.");
    },
  });

  const signIn = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      try {
        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(`${API_BASE_URL}/v1/login-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Invalid credentials");
        }
        return response.json();
      } catch (error) {
        console.error("Sign-in error:", error);
        throw error;
      }
    },
    onSuccess: (_, { email }) => {
      navigate(`/auth/verify-code?email=${email}&codeType=verifySignIn`);
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials.");
    },
  });

  const signOut = async () => {
    try {
      const csrfToken = await fetchCSRFToken();
      if (!csrfToken) {
        throw new Error("Failed to retrieve CSRF token");
      }

      const response = await fetch(`${API_BASE_URL}/v1/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const res = await response.json();
        throw new Error(res.message || "Logout failed");
      }



      localStorage.removeItem("user");
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error( "Logout failed.");
    }
  }



  const requestPasswordReset = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      try {
        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(`${API_BASE_URL}/v1/login-email-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          body: JSON.stringify({ email }),
          credentials: "include",
        });

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Password reset failed");
        }
        return response.json();
      } catch (error) {
        console.error("Password reset request error:", error);
        throw error;
      }
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
      try {
        const csrfToken = await fetchCSRFToken(); // Get fresh CSRF token
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(
          `${API_BASE_URL}/v1/forgot-password-verify-email-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": csrfToken, 
            },
            body: JSON.stringify({ email, otp }),
            credentials: "include", 
          }
        );

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Authentication failed");
        }
        return response.statusText;
      } catch (error) {
        console.error("Verify forgot password code error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("OTP verified successfully.");
      navigate("/auth/new-password");
    },
    onError: (error) => {
      toast.error(error.message || "Authentication failed.");
    },
  });

  const verifySignInCode = useMutation({
    mutationFn: async ({ email, otp }: { email: string; otp: string }) => {
      try {
        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(
          `${API_BASE_URL}/v1/authenticator-validate-code`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": csrfToken,
              Authorization: `Bearer ${
                localStorage.getItem("temp-token") || ""
              }`,
            },
            body: JSON.stringify({ email, code: otp }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Authentication failed");
        }
        return response.json();
      } catch (error) {
        console.error("Verify sign-in code error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Sign-in successful.");

      localStorage.setItem("user", JSON.stringify(data.data));

      setUser(data.data);

      const userRoles = data.data?.roles || [];
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
      try {
        

        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(
          `${API_BASE_URL}/v1/forgot-password-reset-password`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "X-XSRF-TOKEN": csrfToken,
            },
            body: JSON.stringify({
              password: newPassword,
            }),
            credentials: "include",
          }
        );

        if (!response.ok) {
          const res = await response.json();
          throw new Error(res.message || "Password reset failed");
        }
        return response.json();
      } catch (error) {
        console.error("Password reset error:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast.success("Password reset successfully.");

      localStorage.setItem("user", JSON.stringify(data.data));


      setUser(data.data);
      navigate("/");
    },
    onError: (error) => {
      toast.error(error.message || "Password reset failed.");
      navigate("/auth/sign-in");
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      try {
        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(`${API_BASE_URL}/v1/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          credentials: "include",
        });

      console.log("response", response);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error( "Logout failed.");
      }
    }
  })

  // const renewAccessToken = useMutation({
  //   mutationFn: async ({ refreshToken }: { refreshToken: string }) => {
  //     if (!refreshToken) {
  //       throw new Error("No refresh token found");
  //     }

  //     const response = await fetch(`${API_BASE_URL}/v1/renew-access-token`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // "Authorization": `Bearer ${refreshToken}`
  //       },
  //       body: JSON.stringify({
  //         refreshToken: refreshToken,
  //       }),
  //     });

  //     if (!response.ok) throw new Error("Failed to renew access token");
  //     return response.json();
  //   },
  //   onSuccess: (data) => {
  //     // Store the new access token
  //     localStorage.setItem("access-token", data.data.accessToken);
  //     localStorage.setItem("refresh-token", data.data.refreshToken);
  //     localStorage.setItem("user", JSON.stringify(data.data.user));

  //     setUser(data.data.user);

  //     const userRoles = data.data.user?.roles || [];
  //     const haveRoles = userRoles.length > 0;
  //     const redirectTo = haveRoles ? "/auth/role-selection" : "/";

  //     navigate(redirectTo);
  //   },
  //   onError: () => {
  //     toast.error("Failed to get access token. Please try logging in again.");
  //     navigate("/auth/sign-in");
  //   },
  // });

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
        logout : {
          mutate: logout.mutate,
          isLoading: logout.isPending,
          error: logout.error
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
