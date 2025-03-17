import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuthTokens() {
  const queryClient = useQueryClient();

  const renewAccessToken = useMutation({
    mutationFn: async () => {
      const refreshToken = localStorage.getItem("refresh-token");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }

      const response = await fetch("/api/v1/renew-access-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        //   "Authorization": `Bearer ${refreshToken}`
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });

      if (!response.ok) throw new Error("Failed to renew access token");
      return response.json();
    },
    onSuccess: (data) => {
        localStorage.setItem("access-token", data.data.accessToken);
        localStorage.setItem("refresh-token", data.data.refreshToken);

      // Invalidate queries that might depend on the token
      queryClient.invalidateQueries({ queryKey: ["auth"] });

     
    },
    onError: (error) => {
      console.error("Failed to renew access token:", error);
    },
  });

  return { renewAccessToken };
}
