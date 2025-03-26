import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthTokens } from "./authTokens";
import { API_BASE_URL } from "@/constant";
import { useNavigate } from "react-router-dom";
import { CreateApiClient } from "@/service/api-client";
import { useMemo } from "react";

export interface Role {
  usersCount: number;
  id: number;
  name: string;
}

interface RolesResponse {
  data: Role[];
}
const API_URL = `${API_BASE_URL}/v1/admin/roles`;

export const useAdminRolesList = () => {
  const queryClient = useQueryClient();
  const { renewAccessToken } = useAuthTokens();

  const navigate = useNavigate(); 
  const { callApiWithAuth } = CreateApiClient(navigate);

  // ✅ Fetch Users
  const {
    data: rolesResponse,
    isLoading,
    error,
  } = useQuery<RolesResponse, Error>({
    queryKey: ["all-roles-list"],
    retry: false, 
    // queryFn: async () => {
    //   // Try with current access token
    //   try {
    //     const accessToken = localStorage.getItem("access-token");
    //     const response = await fetch(API_URL, {
    //       headers: {
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //     });

    //     if (response.status === 401 || response.status === 403) {
    //       // Token might be expired, try to renew it
    //       try {
    //         await renewAccessToken.mutateAsync();
    //       } catch (err) {
    //         console.log(err);
    //         navigate("/auth/sign-in");
    //       }

    //       // Retry with new token
    //       const newAccessToken = localStorage.getItem("access-token");
    //       const retryResponse = await fetch(API_URL, {
    //         headers: {
    //           Authorization: `Bearer ${newAccessToken}`,
    //         },
    //       });

    //       if (!retryResponse.ok) {
    //         navigate("/auth/sign-in");

    //         throw new Error(`Failed to fetch role: ${retryResponse.status}`);
    //       }

    //       return retryResponse.json();
    //     }

    //     if (!response.ok) {
    //       throw new Error(`Failed to fetch role: ${response.status}`);
    //     }
    //     return response.json();
    //   } catch (err) {
    //     navigate("/auth/sign-in");
    //     throw err;
    //   }
    // },

    queryFn: () =>
      callApiWithAuth<RolesResponse>({ url: API_URL }),
  
  });

  // ✅ Add Role
  const addRole = useMutation({
    mutationFn: async ({ newRole }: { newRole: string }) => {
      // Try with current access token
      try {
        const accessToken = localStorage.getItem("access-token");
        const response = await fetch(`/api/v1/admin/roles/${newRole}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          // Token might be expired, try to renew it
          try {
            await renewAccessToken.mutateAsync();
          } catch (err) {
            console.error("Failed to renew access token:", err);
            navigate("/auth/sign-in");
            return Promise.reject(new Error("Failed to renew access token")); // ✅ Stop execution
          }

          // Retry with new token
          const newAccessToken = localStorage.getItem("access-token");
          const retryResponse = await fetch(`/api/v1/admin/roles/${newRole}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          
          if (!retryResponse.ok) {
            const data = await retryResponse.json();
            throw new Error(`${data.message}`);
          }

          return retryResponse.json();
        }

        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(`${data.message}`);
        }
        return response.json();
      } catch (err) {
        console.error("Error adding role:", err);
        throw err;
      }
    },
    onMutate: async ({ newRole }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["all-roles-list"] });

      const previousRoles = queryClient.getQueryData(["all-roles-list"]);

      queryClient.setQueryData(
        ["all-roles-list"],
        (oldData: RolesResponse | undefined) => {
          if (oldData === null || oldData === undefined) {
            return {
              success: true,
              status: 200,
              message: "List of roles fetched successfully.",
              data: [{ id: Date.now(), name: newRole }], // Temporary ID
              timestamp: new Date().toISOString(),
            };
          }

          return {
            ...oldData,
            data: [...oldData.data, { id: Date.now(), name: newRole }], // Temporary ID
          };
        }
      );

      // Return a context object with the previous data
      return { previousRoles };
    },
    onError: (err, _, context) => {
      toast.error(`${err.message}`);
      // If there was an error, roll back to the previous value
      if (context?.previousRoles) {
        queryClient.setQueryData(["all-roles-list"], context.previousRoles);
      }
    },
    onSuccess: () => {
      toast.success("Role added successfully!");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles-list"] });
    },
  });

  // ✅ Delete Role
  const deleteRole = useMutation({
    mutationFn: async ({ roleId }: { roleId: number }) => {
      // Try with current access token
      try {
        const accessToken = localStorage.getItem("access-token");
        const response = await fetch(`/api/v1/admin/roles/${roleId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 401 || response.status === 403) {
          // Token might be expired, try to renew it
          await renewAccessToken.mutateAsync();

          // Retry with new token
          const newAccessToken = localStorage.getItem("access-token");
          const retryResponse = await fetch(`/api/v1/admin/roles/${roleId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`Failed to delete role: ${retryResponse.status}`);
          }

          return retryResponse.json();
        }

        if (!response.ok) {
          throw new Error(`Failed to delete role: ${response.status}`);
        }
        return response.json();
      } catch (err) {
        console.error("Error deleting role:", err);
        throw err;
      }
    },
    onMutate: async ({ roleId }) => {
      await queryClient.cancelQueries({ queryKey: ["all-roles-list"] });

      const previousRoles = queryClient.getQueryData(["all-roles-list"]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        ["all-roles-list"],
        (oldData: RolesResponse | undefined) => {
          if (oldData === null || oldData === undefined) {
            return { data: [] };
          }

          return {
            ...oldData,
            data: oldData.data.filter((role) => role.id !== roleId),
          };
        }
      );

      // Return a context object with the previous data
      return { previousRoles };
    },
    onError: (err, _, context) => {
      toast.error(`Failed to delete role: ${err.message}`);
      // If there was an error, roll back to the previous value
      if (context?.previousRoles) {
        queryClient.setQueryData(["all-roles-list"], context.previousRoles);
      }
    },
    onSuccess: () => {
      toast.success("Role deleted successfully!");
    },
    onSettled: () => {
      // Always invalidate the query to get the actual server state
      queryClient.invalidateQueries({ queryKey: ["all-roles-list"] });
    },
  });

  const roles = rolesResponse?.data || [];
  return { roles, isLoading, error, addRole, deleteRole };
};
