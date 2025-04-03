import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserList } from "@/hooks/admin-userslist";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserList | null;
  onUserChange: (user: UserList) => void;
  onSave: () => void;
}

export function EditUserDialog({
  open,
  onOpenChange,
  user,
  onUserChange,
  onSave,
}: EditUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  if (!user) return null;
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Make changes to the user details.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-id" className="text-right">
              ID
            </Label>
            <Input
              id="user-id"
              value={user.id}
              className="col-span-3"
              disabled
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-email" className="text-right">
              Email
            </Label>
            <Input
              id="user-email"
              type="email"
              value={user.email}
              className="col-span-3"
              disabled
              // onChange={(e) => onUserChange({ ...user, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-name" className="text-right">
              Name
            </Label>
            <Input
              id="user-name"
              value={user.name}
              className="col-span-3"
              onChange={(e) => onUserChange({ ...user, name: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-name" className="text-right">
              Password
            </Label>
            <div className="relative w-full col-span-3">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter New password"
                className=""
                onChange={(e) =>
                  onUserChange({ ...user, password: e.target.value })
                }
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-status" className="text-right">
              Status
            </Label>
            <Select
              value={user.enabled ? "active" : "inactive"}
              onValueChange={(value) =>
                onUserChange({ ...user, enabled: value === "active" })
              }
            >
              <SelectTrigger id="user-status" className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
