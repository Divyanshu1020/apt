import { useAuthTokens } from "@/hooks/authTokens";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ApiOptions = {
  url: string;
  method?: ApiMethod;
  body?: any;
  contentType?: string;
};

export const CreateApiClient = (navigate?: (value: string) => void) => {
  const { renewAccessToken } = useAuthTokens(navigate);
  let isRefreshing = false;
  let refreshTokenPromise: Promise<void> | null = null;

  const callApiWithAuth = async <T>({
    url,
    method = "GET",
    body,
    contentType = "application/json",
  }: ApiOptions): Promise<T> => {
    const createRequestOptions = (token: string) => {
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(contentType && { "Content-Type": contentType }),
        },
      };

      if (body) {
        options.body = contentType === "application/json" ? JSON.stringify(body) : body;
      }

      return options;
    };

    const performRequest = async (token: string) => {
      const response = await fetch(url, createRequestOptions(token));
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
      }

      return response.json();
    };

    try {
      let accessToken = localStorage.getItem("access-token") || "";
      
      try {
        return await performRequest(accessToken);
      } catch (error: any) {
        // Check if the error is due to unauthorized access
        if (error.message.includes('401') || error.message.includes('403')) {
          // Ensure only one token refresh happens
          if (!isRefreshing) {
            isRefreshing = true;
            refreshTokenPromise = renewAccessToken.mutateAsync()
              .then(() => {
                accessToken = localStorage.getItem("access-token") || "";
              })
              .catch((err) => {
                console.error("Failed to renew access token:", err);
                if (navigate) {
                  navigate("/auth/sign-in");
                }
                throw new Error("Authentication failed, please sign in again.");
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          // Wait for the token refresh to complete
          await refreshTokenPromise;

          // Retry the original request
          return await performRequest(accessToken);
        }

        // If it's not an authorization error, rethrow
        throw error;
      }
    } catch (err) {
      console.error("API Request Error:", err);
      if (navigate) {
        navigate("/auth/sign-in");
      }
      throw err;
    }
  };

  return { callApiWithAuth };
};