import { API_BASE_URL } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useAuthTokens(navigate?: (value: string) => void) {
  const queryClient = useQueryClient();

  const renewAccessToken = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refresh-token");

      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch(`${API_BASE_URL}/v1/renew-access-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error(`Token renewal failed (${response.status}): ${await response.text()}`);
      }

      return response.json();
    },
    retry: 0, 
    onSuccess: (data) => {
      if (!data.data?.accessToken || !data.data?.refreshToken) {
        throw new Error("Invalid token response from server");
      }

      localStorage.setItem("access-token", data.data.accessToken);
      localStorage.setItem("refresh-token", data.data.refreshToken);

      // Invalidate queries that depend on authentication
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
    onError: () => {
      toast.error("Session expired. Please sign in again.");

      localStorage.removeItem("user");
      localStorage.removeItem("access-token");
      localStorage.removeItem("refresh-token");

      
      if (navigate) {
        navigate("/auth/sign-in");
      }
    },
  });

  return { renewAccessToken };
}
