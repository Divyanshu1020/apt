"use client";

import { PlusCircle, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRoleName } from "@/helper";
import { useAdminRolesList } from "@/hooks/admin-roleslist";

export default function Roles() {
  const { roles, addRole, deleteRole } = useAdminRolesList();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [newRole, setNewRole] = useState({
    id: "",
    name: "",
    usersCount: 0,
  });

  const handleSetNewRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewRole({ ...newRole, name: e.target.value });
  };
  // Filter roles based on search term
  const filteredRoles = roles.filter(
    (role) =>
      searchTerm === "" ||
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddRole = () => {
    const name = `ROLE_${newRole.name
      .trim()
      .toUpperCase()
      .replace(/\s+/g, "_")}`;
    addRole.mutate({ newRole: name });
    setIsAddDialogOpen(false);
  };

  // const handleEditRole = (role: any) => {
  //   setEditingRole({ ...role });
  //   setIsEditDialogOpen(true);
  // };

  const handleSaveRole = () => {
    // setRoles(roles.map((role) => (role.id === editingRole.id ? editingRole : role)))
    setIsEditDialogOpen(false);
  };

  const handleDeleteRole = (role: any) => {
    setEditingRole(role);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRole = () => {
    // setRoles(roles.filter((role) => role.id !== editingRole.id))
    deleteRole.mutate({ roleId: editingRole.id });
    setIsDeleteDialogOpen(false);
  };

  // const togglePermission = (permission: string, target: "new" | "edit") => {
  //   if (target === "new") {
  //     setNewRole({
  //       ...newRole,
  //       permissions: newRole.permissions.includes(permission)
  //         ? newRole.permissions.filter((p) => p !== permission)
  //         : [...newRole.permissions, permission],
  //     })
  //   } else {
  //     setEditingRole({
  //       ...editingRole,
  //       permissions: editingRole.permissions.includes(permission)
  //         ? editingRole.permissions.filter((p: string) => p !== permission)
  //         : [...editingRole.permissions, permission],
  //     })
  //   }
  // }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles</h1>
          <p className="text-muted-foreground">
            Manage system roles and permissions
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Role
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Role Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search roles..."
              className="pl-8 w-full sm:w-[250px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  {/* <TableHead>Description</TableHead> */}
                  {/* <TableHead>Permissions</TableHead> */}
                  <TableHead>Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No roles found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">
                        {formatRoleName(role.name)}
                      </TableCell>
                      {/* <TableCell>{role.description}</TableCell> */}
                      {/* <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline">
                              {permission.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </TableCell> */}
                      <TableCell>{role.usersCount || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleDeleteRole(role)}
                          variant="destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete role
                        </Button>
                        {/* <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditRole(role)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit role
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteRole(role)}
                              disabled={role.usersCount > 0}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Role Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Role</DialogTitle>
            <DialogDescription>
              Create a new role with specific permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-name" className="text-right">
                Name
              </Label>
              <Input
                id="role-name"
                value={newRole.name}
                className="col-span-3"
                onChange={(e) => handleSetNewRole(e)}
              />
            </div>
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role-description" className="text-right">
                Description
              </Label>
              <Input
                id="role-description"
                value={newRole.description}
                className="col-span-3"
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div> */}
            {/* <div className="grid grid-cols-4 gap-4">
              <Label className="text-right pt-2">Permissions</Label>
              <div className="col-span-3 space-y-3">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${permission.id}`}
                      checked={newRole.permissions.includes(permission.id)}
                      onCheckedChange={() => togglePermission(permission.id, "new")}
                    />
                    <Label htmlFor={`permission-${permission.id}`}>{permission.name}</Label>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddRole}
              disabled={
                !newRole.name || addRole.isPending
                // || !newRole.description
                // || newRole.permissions.length === 0
              }
            >
              {addRole.isPending ? "Adding..." : "Add Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Make changes to the role details and permissions.
            </DialogDescription>
          </DialogHeader>
          {editingRole && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-id" className="text-right">
                  ID
                </Label>
                <Input
                  id="edit-role-id"
                  value={editingRole.id}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-role-name"
                  value={editingRole.name}
                  className="col-span-3"
                  onChange={(e) =>
                    setEditingRole({ ...editingRole, name: e.target.value })
                  }
                />
              </div>
              {/* <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-role-description" className="text-right">
                  Description
                </Label>
                <Input
                  id="edit-role-description"
                  value={editingRole.description}
                  className="col-span-3"
                  onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })}
                />
              </div> */}
              {/* <div className="grid grid-cols-4 gap-4">
                <Label className="text-right pt-2">Permissions</Label>
                <div className="col-span-3 space-y-3">
                  {allPermissions.map((permission) => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-permission-${permission.id}`}
                        checked={editingRole.permissions.includes(permission.id)}
                        onCheckedChange={() => togglePermission(permission.id, "edit")}
                      />
                      <Label htmlFor={`edit-permission-${permission.id}`}>{permission.name}</Label>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRole}
              disabled={
                !editingRole?.name
                // || !editingRole?.description
                // || editingRole?.permissions.length === 0
              }
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Role Confirmation */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the role "{editingRole?.name}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRole}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
