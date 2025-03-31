import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRoleName } from "@/helper";
import { UserList } from "@/hooks/admin-userslist";
import { format } from "date-fns";
import { Check, MoreHorizontal, X } from "lucide-react";

interface UserTableProps {
  users: UserList[];
  onEditUser?: (user: UserList) => void;
  onManageRoles: (user: UserList) => void;
  onToggleStatus: (userId: number) => void;
}

export function UserTable({
  users,
  // onEditUser,
  onManageRoles,
  onToggleStatus,
}: UserTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Roles</TableHead>
            <TableHead>Registered</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="h-24 text-center">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.enabled === true ? "default" : "secondary"}
                  >
                    {user.enabled === true ? (
                      <Check className="mr-1 h-3 w-3" />
                    ) : (
                      <X className="mr-1 h-3 w-3" />
                    )}
                    {user.enabled ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role, index) => (
                      <Badge key={index} variant="outline">
                        { formatRoleName(role.name)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(user.createdAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {format(new Date(user.updatedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      {/* <DropdownMenuItem onClick={() => onEditUser(user)}>
                        Edit user
                      </DropdownMenuItem> */}
                      <DropdownMenuItem onClick={() => onManageRoles(user)}>
                        Manage roles
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onToggleStatus(user.id)} className={`${user.enabled === true ? "text-red-600" : "text-green-600"}`} >
                        {user.enabled === true ? "Deactivate" : "Activate"}{" "}
                        user
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
