import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthTokens } from "./authTokens";
import { API_BASE_URL } from "@/constant";

interface Role {
  id: number;
  name: string;
}

export interface UserList {
  id: number;
  email: string;
  name: string;
  enabled: boolean;
  createdAt: string; 
  updatedAt: string; 
  roles: Role[];
}

interface UsersResponse {
  data: UserList[];
  // total?: number;
  // page?: number;
  // pageSize?: number;
}

const API_URL = `${API_BASE_URL}/v1/admin/users`;

export const useAdminUsersList = () => {
  const queryClient = useQueryClient();

  const { renewAccessToken } = useAuthTokens();

  // ✅ Fetch Users
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useQuery<UsersResponse, Error>({
    queryKey: ["all-users-list"],
    queryFn: async () => {
      // Try with current access token
      try {
        const accessToken = localStorage.getItem("access-token");
        const response = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        
        if (response.status === 401 || response.status === 403) {
          // Token might be expired, try to renew it
          await renewAccessToken.mutateAsync();
          
          // Retry with new token
          const newAccessToken = localStorage.getItem("access-token");
          const retryResponse = await fetch(API_URL, {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Failed to fetch users: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch users: ${response.status}`);
        }
        
        return response.json();
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
  });

  // ✅ Update User
  const updateUser = useMutation({
    mutationFn: async ({ id, userData }: { id: number; userData: any }) => {

  
      



      try {
        const accessToken = localStorage.getItem("access-token");
        const response = await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${accessToken}`
          },
          body: JSON.stringify(userData),
        });
        
        if (response.status === 401 || response.status === 403) {
          // Token might be expired, try to renew it
          await renewAccessToken.mutateAsync();
          
          // Retry with new token
          const newAccessToken = localStorage.getItem("access-token");
          const retryResponse = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { 
              "Content-Type": "application/json", 
              "Authorization": `Bearer ${newAccessToken}`
            },
            body: JSON.stringify(userData),
          });
          
          if (!retryResponse.ok) {
            throw new Error(`Failed to update user: ${retryResponse.status}`);
          }
          
          return retryResponse.json();
        }
        
        if (!response.ok) {
          throw new Error(`Failed to update user: ${response.status}`);
        }
        
        return response.json();
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }



    },
    onMutate: async ({ id, userData }) => {
      await queryClient.cancelQueries({ queryKey: ["all-users-list"] });
  
      const previousUsers = queryClient.getQueryData(["all-users-list"]);
  
      queryClient.setQueryData(["all-users-list"], (oldData: UsersResponse | undefined) => {
        if (oldData === null || oldData === undefined) {
          return { data: [] }; // or some other default value
        }
        return {
          ...oldData,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: oldData.data.map((user: any) =>
            user.id === id ? { ...user, ...userData } : user
          ),
        };
      });
  
      return { previousUsers };
    },
    onError: (_err, _, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-list"] });
    },
  });
  


  const users = usersResponse?.data || [];
  return { users, isLoading, error, updateUser };
};
