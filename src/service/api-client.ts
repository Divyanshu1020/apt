import { useAuthTokens } from "@/hooks/authTokens";
import { useCSRF } from "@/hooks/csrf-token";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type ApiOptions = {
  url: string;
  method?: ApiMethod;
  body?: any;
  contentType?: string;
};

export const CreateApiClient = (navigate?: (value: string) => void) => {
  const { renewAccessToken } = useAuthTokens(navigate);
  const { fetchCSRFToken } = useCSRF();
  let isRefreshing = false;

  const callApiWithAuth = async <T>({
    url,
    method = "GET",
    body,
    contentType = "application/json",
  }: ApiOptions): Promise<T> => {
    const createRequestOptions = async () => {
      const options: RequestInit = {
        method,
        headers: {
          // Authorization: `Bearer ${token}`,
          ...(contentType && { "Content-Type": contentType }),
          ...(method !== "GET" && { "X-XSRF-TOKEN": await fetchCSRFToken() }),
        },
        credentials: "include",
      };

      if (body) {
        options.body =
          contentType === "application/json" ? JSON.stringify(body) : body;
      }

      return options;
    };

    const performRequest = async () => {
      const response = await fetch(url, await createRequestOptions());

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(
          `API Error (${response.status}): ${errorData || response.statusText}`
        );
      }

      return response.json();
    };

    try {
      // let accessToken = localStorage.getItem("access-token") || "";

      try {
        return await performRequest();
      } catch (error: any) {
        // Check if the error is due to unauthorized access
        if (error.message.includes("401") || error.message.includes("403")) {
          // Ensure only one token refresh happens
          if (!isRefreshing) {
            isRefreshing = true;
            await renewAccessToken.mutateAsync().finally(() => {
              isRefreshing = false;
            });
          }


          // Retry the original request
          return await performRequest();
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
