import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface Role {
  usersCount: number;
  id: number;
  name: string;
}



interface RolesResponse {
  data: Role[];
}

const API_URL = "/api/v1/admin/roles";

export const useAdminRolesList = () => {
  const queryClient = useQueryClient();

  // ✅ Fetch Users
  const {
    data: rolesResponse,
    isLoading,
    error,
  } = useQuery<RolesResponse, Error>({
    queryKey: ["all-roles-list"],
    queryFn: async () => {
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  // ✅ Update Roles
  const addRole = useMutation({
    mutationFn: async ({ newRole }: { newRole: string}) => {
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch(`/api/v1/admin/roles/${newRole}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles-list"] }); // Refetch users after update
    },
  });

  const deleteRole = useMutation({
    mutationFn: async ({ roleId }: { roleId: number }) => {
      const accessToken = localStorage.getItem("access-token");
      const response = await fetch(`/api/v1/admin/roles/${roleId}`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-roles-list"] }); // Refetch users after update
    },
  })


  const roles = rolesResponse?.data || [];
  return { roles, isLoading, error, addRole, deleteRole };
};
