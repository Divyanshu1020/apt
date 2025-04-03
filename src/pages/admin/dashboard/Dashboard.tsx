import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminRolesList } from "@/hooks/admin-roleslist";
import { useAdminUsersList, UserList } from "@/hooks/admin-userslist";
import { EditUserDialog } from "./components/EditUserDialog";
import { ManageRolesDialog } from "./components/ManageRolesDialog";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";

export default function Dashboard() {
  const { users, isLoading, error, addNewRolesInUser, removeRolesInUser, toggleUserStatus, updateUser } = useAdminUsersList();
  const { roles } = useAdminRolesList();

  // const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<UserList | null>(null);
  const [beforeEditUser, setBeforeEditUser] = useState<UserList | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === null ||
      (statusFilter === "active" ? user.enabled : !user.enabled);
    const matchesRole =
      roleFilter === null ||
      user.roles.some((role) => role.name === roleFilter);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEditUser = (user: UserList) => {
    setEditingUser({ ...user });
    setBeforeEditUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser || !beforeEditUser) return;
  
  
    // Remove password if it's the same as before
    // if (editingUser.password === beforeEditUser.password) {
    //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //   const { password, ...rest } = editingUser; // Remove password
    //   updateUser.mutate(rest);
    // }
  
    // console.log("editingUser", editingUser);
    updateUser.mutate(editingUser);
    setIsEditDialogOpen(false);
  };

  const handleManageRoles = (user: UserList) => {
    setEditingUser({ ...user });
    setBeforeEditUser({ ...user });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRoles = () => {
    if (!editingUser) return;

  const removedRoles = beforeEditUser?.roles.filter(
    (role) => !editingUser.roles.some((r) => r.id === role.id)
  );

  const addedRoles = editingUser.roles.filter(
    (role) => !beforeEditUser?.roles.some((r) => r.id === role.id)
  );


    // Remove roles in one API call if needed
    if ( removedRoles && removedRoles.length > 0) {
       removeRolesInUser.mutate({
        editingUser: editingUser,
        roleIds: removedRoles,
      });
    }


    // Add new roles in one API call if needed
    if (addedRoles.length > 0) {
       addNewRolesInUser.mutate({
        editingUser: editingUser,
        roleIds: addedRoles,
      });
    }

    setIsRoleDialogOpen(false);
  };

  const handleToggleStatus = (userId: number) => {
    // setUsers(
    //   users.map((user) =>
    //     user.id === userId
    //       ? { ...user, status: user.status === "active" ? "inactive" : "active" }
    //       : user
    //   )
    // );

    toggleUserStatus.mutate({ id: userId });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>User Management</CardTitle>
          <UserFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            allRoles={roles}
          />
        </CardHeader>
        <CardContent>
          <UserTable
            users={filteredUsers}
            onEditUser={handleEditUser}
            onManageRoles={handleManageRoles}
            onToggleStatus={handleToggleStatus}
          />
        </CardContent>
      </Card>

      <EditUserDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={editingUser}
        onUserChange={setEditingUser}
        onSave={handleSaveUser}
      />

      <ManageRolesDialog
        open={isRoleDialogOpen}
        onOpenChange={setIsRoleDialogOpen}
        user={editingUser}
        onUserChange={setEditingUser}
        onSave={handleSaveRoles}
        allRoles={roles}
      />
    </div>
  );
}
