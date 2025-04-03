import { API_BASE_URL } from "@/constant";
import { CreateApiClient } from "@/service/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const API_USERS_URL = `${API_BASE_URL}/v1/admin/users`;
const API_ADD_ROLES_URL = `${API_BASE_URL}/v1/admin/add-multiple-role`;
const API_REMOVE_ROLES_URL = `${API_BASE_URL}/v1/admin/remove-multiple-role`;
const API_TOGGLE_USER_URL = `${API_BASE_URL}/v1/admin/users/enable/`;
const API_UPDATE_USER_URL = `${API_BASE_URL}/v1/admin/users`;

interface Role {
  id: number;
  name: string;
}

export interface UserList {
  id: number;
  email: string;
  name: string;
  password: string;
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

export const useAdminUsersList = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { callApiWithAuth } = CreateApiClient(navigate)

  // Fetch users
  const {
    data: usersResponse,
    isLoading,
    error,
  } = useQuery<UsersResponse, Error>({
    queryKey: ["all-users-list"],
    retry: false, 
    
    queryFn: () =>
      callApiWithAuth<UsersResponse>({ url: API_USERS_URL }),
  },

);

  // add new role in user
  const addNewRolesInUser = useMutation({
    mutationFn: async ({
      editingUser,
      roleIds,
    }: {
      editingUser: UserList;
      roleIds: Role[];
    }) => {
      return callApiWithAuth<any>({
        url: API_ADD_ROLES_URL,
        method: "POST",
        body: {
          userId: editingUser.id,
          roleIds: roleIds.map((r) => r.id),
        },
      });
    },
    onMutate: async ({ editingUser }: { editingUser: UserList }) => {
      await queryClient.cancelQueries({ queryKey: ["all-users-list"] });

      const previousUsers = queryClient.getQueryData(["all-users-list"]);

      queryClient.setQueryData(
        ["all-users-list"],
        (oldData: UsersResponse | undefined) => {
          if (oldData === null || oldData === undefined) {
            return { data: [] }; // or some other default value
          }
          return {
            ...oldData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: oldData.data.map((user: any) =>
              user.id === editingUser.id
                ? { ...user, roles: editingUser.roles }
                : user
            ),
          };
        }
      );

      return { previousUsers };
    },
    onError: (_err, _, context) => {
      queryClient.setQueryData(["users"], context?.previousUsers);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["all-users-list"] });
    // },
  });

  // remove role in user
  const removeRolesInUser = useMutation({
    mutationFn: async ({
      editingUser,
      roleIds,
    }: {
      editingUser: UserList;
      roleIds: Role[];
    }) => {
      return callApiWithAuth<any>({
        url: API_REMOVE_ROLES_URL,
        method: "DELETE",
        body: {
          userId: editingUser.id,
          roleIds: roleIds.map((r) => r.id),
        },
      });
    },
    onMutate: async ({ editingUser }: { editingUser: UserList }) => {
      await queryClient.cancelQueries({ queryKey: ["all-users-list"] });

      const previousUsers = queryClient.getQueryData(["all-users-list"]);

      queryClient.setQueryData(
        ["all-users-list"],
        (oldData: UsersResponse | undefined) => {
          if (oldData === null || oldData === undefined) {
            return { data: [] }; // or some other default value
          }
          return {
            ...oldData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: oldData.data.map((user: any) =>
              user.id === editingUser.id
                ? { ...user, roles: editingUser.roles }
                : user
            ),
          };
        }
      );

      return { previousUsers };
    },
    onError: (_err, _, context) => {
      queryClient.setQueryData(["all-users-list"], context?.previousUsers);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["all-users-list"] });
    // },
  });

  const toggleUserStatus = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      return callApiWithAuth<any>({
        url: API_TOGGLE_USER_URL + id,
        method: "PUT",
      });
    },
    onMutate: async ({ id }: { id: number }) => {
      await queryClient.cancelQueries({ queryKey: ["all-users-list"] });

      const previousUsers = queryClient.getQueryData(["all-users-list"]);

      queryClient.setQueryData(
        ["all-users-list"],
        (oldData: UsersResponse | undefined) => {
          if (oldData === null || oldData === undefined) {
            return { data: [] }; // or some other default value
          }
          return {
            ...oldData,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: oldData.data.map((user: any) =>
              user.id === id ? { ...user, enabled: !user.enabled } : user
            ),
          };
        }
      );

      return { previousUsers };
    },
    onError: (_err, _, context) => {
      queryClient.setQueryData(["all-users-list"], context?.previousUsers);
    },
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["all-users-list"] });
    // },
  });

  const updateUser = useMutation({
    mutationFn: async (user: any) => {
      return callApiWithAuth({
        url: API_UPDATE_USER_URL,
        method: "PUT",
        body: user,
      });
    },
    onMutate: async (user) => {
      await queryClient.cancelQueries({ queryKey: ["all-users-list"] });
  
      const previousUsers = queryClient.getQueryData<UsersResponse>(["all-users-list"]);
  
      queryClient.setQueryData(["all-users-list"], (oldData: UsersResponse | undefined) => {
        if (!oldData) return { data: [] }; // Ensure data structure consistency
  
        return {
          ...oldData,
          data: oldData.data.map((u: UserList) => (u.id === user.id ? { ...user } : u)),
        };
      });
  
      return { previousUsers };
    },
    onError: (_err, _, context) => {
      toast.error(`Error updating user: ${_err}`);
      if (context?.previousUsers) {
        queryClient.setQueryData(["all-users-list"], context.previousUsers);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users-list"] });
    },
  });
  

  const users = usersResponse?.data || [];
  return {
    users,
    isLoading,
    error,
    addNewRolesInUser,
    removeRolesInUser,
    toggleUserStatus,
    updateUser
  };
};
