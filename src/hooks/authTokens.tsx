import { API_BASE_URL } from "@/constant";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


export function useAuthTokens() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        //   "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (!response.ok || response.status === 401 || response.status === 403) {
        // remove user from local storage
        localStorage.removeItem("user");
        navigate("/auth/sign-in");

        throw new Error("Failed to renew access token");
      }

      return response.json();
    },
    onSuccess: (data) => {
        localStorage.setItem("access-token", data.data.accessToken);
        localStorage.setItem("refresh-token", data.data.refreshToken);

      // Invalidate queries that might depend on the token
      queryClient.invalidateQueries({ queryKey: ["auth"] });

     
    },
    onError: (error) => {
      navigate("/auth/sign-in");
      console.error("Failed to renew access token:", error);
    },
  });

  return { renewAccessToken };
}
