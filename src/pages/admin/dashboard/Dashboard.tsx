import { useState } from "react";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { allRoles, initialUsers } from "@/temp_db";
import { User } from "@/types/admin/user";
import { UserFilters } from "./components/UserFilters";
import { UserTable } from "./components/UserTable";
import { EditUserDialog } from "./components/EditUserDialog";
import { ManageRolesDialog } from "./components/ManageRolesDialog";


export default function Dashboard() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchTerm === "" ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === null || user.status === statusFilter;
    const matchesRole = roleFilter === null || user.roles.includes(roleFilter as any);

    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleEditUser = (user: User) => {
    setEditingUser({ ...user });
    setIsEditDialogOpen(true);
  };

  const handleSaveUser = () => {
    if (!editingUser) return;
    setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
    setIsEditDialogOpen(false);
  };

  const handleManageRoles = (user: User) => {
    setEditingUser({ ...user });
    setIsRoleDialogOpen(true);
  };

  const handleSaveRoles = () => {
    if (!editingUser) return;
    setUsers(users.map((user) => (user.id === editingUser.id ? editingUser : user)));
    setIsRoleDialogOpen(false);
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? { ...user, status: user.status === "active" ? "inactive" : "active" }
          : user
      )
    );
  };

  

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
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
            allRoles={allRoles}
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
        allRoles={allRoles}
      />
    </div>
  );
}