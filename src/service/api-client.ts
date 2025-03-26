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

    try {
      let accessToken = localStorage.getItem("access-token") || "";
      let response = await fetch(url, createRequestOptions(accessToken));

      if (response.status === 401 || response.status === 403) {
        try {
          await renewAccessToken.mutateAsync();
          accessToken = localStorage.getItem("access-token") || "";

          response = await fetch(url, createRequestOptions(accessToken));

          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
          }
        } catch (err) {
          console.error("Failed to renew access token:", err);
          if (navigate) {
            navigate("/auth/sign-in");
          }
          return Promise.reject(new Error("Authentication failed, please sign in again."));
        }
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
      }

      return response.json();
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