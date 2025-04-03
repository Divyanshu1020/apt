import { API_BASE_URL } from "@/constant";

const API_URL = `${API_BASE_URL}/v1/csrf-token`;

export const useCSRF = () => {
  const fetchCSRFToken = async () => {
    try {
      const response = await fetch(API_URL, { credentials: "include" });
      
      const data = await response.json();
      return data?.token;
    } catch (error) {
      console.error("CSRF Token Fetch Error:", error);
      return null;
    }
  };

  return { fetchCSRFToken };
};
