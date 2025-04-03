import { API_BASE_URL } from "@/constant";
import { useAuth } from "@/context/AuthProvider";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCSRF } from "./csrf-token";

export function useAuthTokens(navigate?: (value: string) => void) {
  const { setUser } = useAuth();
  const { fetchCSRFToken } = useCSRF();

  const renewAccessToken = useMutation({
    mutationFn: async () => {
      try {
        const csrfToken = await fetchCSRFToken();
        if (!csrfToken) {
          throw new Error("Failed to retrieve CSRF token");
        }

        const response = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-XSRF-TOKEN": csrfToken,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(
            `Token renewal failed (${
              response.status
            }): ${await response.text()}`
          );
        }

        return response.statusText;
      } catch (error) {
        console.error("Error renewing access token:", error);
        throw error;
      }
    },
    retry: 0,

    onError: () => {
      toast.error("Session expired. Please sign in again.");

      localStorage.removeItem("user");
      // remove cookies accestoken
      setUser(null);

      if (navigate) {
        navigate("/auth/sign-in");
      }
    },
  });

  return { renewAccessToken };
}
