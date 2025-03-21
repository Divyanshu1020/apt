import { useAuthTokens } from "@/hooks/authTokens";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
type ApiOptions = {
  url: string;
  method?: ApiMethod;
  body?: any;
  contentType?: string;
};

export const CreateApiClient = () => {
  const { renewAccessToken } = useAuthTokens();

  const callApiWithAuth = async <T>({
    url,
    method = "GET",
    body,
    contentType = "application/json"
  }: ApiOptions): Promise<T> => {
    const createRequestOptions = (token: string) => {
      const options: RequestInit = {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          ...(contentType && { "Content-Type": contentType })
        }
      };
      
      if (body) {
        options.body = contentType === "application/json" ? JSON.stringify(body) : body;
      }
      
      return options;
    };

    try {
      const accessToken = localStorage.getItem("access-token") || "";
      const response = await fetch(url, createRequestOptions(accessToken));

      if (response.status === 401 || response.status === 403) {
        await renewAccessToken.mutateAsync();
        const newAccessToken = localStorage.getItem("access-token") || "";
        
        const retryResponse = await fetch(url, createRequestOptions(newAccessToken));
        
        if (!retryResponse.ok) {
          const errorData = await retryResponse.text();
          throw new Error(`API Error (${retryResponse.status}): ${errorData || retryResponse.statusText}`);
        }
        
        return retryResponse.json();
      }

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`API Error (${response.status}): ${errorData || response.statusText}`);
      }
      
      return response.json();
    } catch (err) {
      console.error(`Error calling API ${method} ${url}:`, err);
      throw err;
    }
  };

  return { callApiWithAuth };
};
