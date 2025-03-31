import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { formatRoleName } from "@/helper";
import { Role } from "@/hooks/admin-roleslist";
import { UserList } from "@/hooks/admin-userslist";

interface ManageRolesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserList | null;
  onUserChange: (user: UserList) => void;
  onSave: () => void;
  allRoles: Role[];
}

export function ManageRolesDialog({
  open,
  onOpenChange,
  user,
  onUserChange,
  onSave,
  allRoles,
}: ManageRolesDialogProps) {
  if (!user) return null;

  const handleRoleToggle = (role : Role) => {
    const updatedRoles = user.roles.some(r => r.id === role.id)
      ? user.roles.filter((r) => r.id !== role.id)
      : [...user.roles, role];

    onUserChange({ ...user, roles: updatedRoles as Role[] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage User Roles</DialogTitle>
          <DialogDescription>Assign or remove roles for {user.name}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-4">
          {allRoles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`role-${role.id}`}
                  checked={user.roles.some(r => r.id === role.id)}
                  onCheckedChange={() => handleRoleToggle(role)}
                />
                <Label htmlFor={`role-${role.id}`}>{formatRoleName(role.name)}</Label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save roles</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}