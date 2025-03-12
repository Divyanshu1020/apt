import { useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/admin/user";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  roleFilter: string | null;
  setRoleFilter: (role: string | null) => void;
  allRoles: UserRole[];
}

export function UserFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  allRoles,
}: UserFiltersProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const clearFilters = () => {
    setStatusFilter(null);
    setRoleFilter(null);
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email or ID..."
          className="pl-8 w-full sm:w-[250px]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative">
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {(statusFilter || roleFilter) && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 p-0 flex items-center justify-center">
                {(statusFilter ? 1 : 0) + (roleFilter ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-4">
          <div className="space-y-4">
            <h4 className="font-medium">Filter Users</h4>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={statusFilter || "any"} 
                onValueChange={(value) => setStatusFilter(value === "any" ? null : value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Any status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={roleFilter || "any"} 
                onValueChange={(value) => setRoleFilter(value === "any" ? null : value)}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Any role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any role</SelectItem>
                  {allRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}