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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserList } from "@/hooks/admin-userslist";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserList | null;
  onUserChange: (user: UserList) => void;
  onSave: () => void;
}

export function EditUserDialog({ open, onOpenChange, user, onUserChange, onSave }: EditUserDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Make changes to the user details.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-id" className="text-right">
              ID
            </Label>
            <Input id="user-id" value={user.id} className="col-span-3" disabled />
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
            <Label htmlFor="user-email" className="text-right">
              Email
            </Label>
            <Input
              id="user-email"
              type="email"
              value={user.email}
              className="col-span-3"
              onChange={(e) => onUserChange({ ...user, email: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user-status" className="text-right">
              Status
            </Label>
            <Select
              value={user.enabled ? "active" : "inactive"}
              onValueChange={(value) => onUserChange({ ...user, enabled: value === "active" })}
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