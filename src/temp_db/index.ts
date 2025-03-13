import { Permission, Role } from "@/types/admin/role";
import { User, UserRole } from "@/types/admin/user";


export const allRoles: UserRole[] = ["Admin", "Editor", "Viewer", "Manager", "Support"];

export const initialUsers: User[] = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "active",
    roles: ["Admin", "Editor"],
    registeredDate: "2023-01-15T10:30:00",
    updatedDate: "2023-05-20T14:45:00",
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "active",
    roles: ["Editor"],
    registeredDate: "2023-02-10T09:15:00",
    updatedDate: "2023-04-18T11:20:00",
  },
  {
    id: "USR003",
    name: "Robert Johnson",
    email: "robert.j@example.com",
    status: "inactive",
    roles: ["Viewer"],
    registeredDate: "2023-03-05T16:45:00",
    updatedDate: "2023-03-05T16:45:00",
  },
  {
    id: "USR004",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    status: "active",
    roles: ["Admin"],
    registeredDate: "2023-01-20T13:10:00",
    updatedDate: "2023-06-12T10:30:00",
  },
  {
    id: "USR005",
    name: "Michael Wilson",
    email: "michael.w@example.com",
    status: "active",
    roles: ["Editor", "Viewer"],
    registeredDate: "2023-04-08T11:25:00",
    updatedDate: "2023-05-30T09:15:00",
  },
  {
    id: "USR006",
    name: "Sarah Brown",
    email: "sarah.b@example.com",
    status: "inactive",
    roles: ["Viewer"],
    registeredDate: "2023-02-28T15:40:00",
    updatedDate: "2023-02-28T15:40:00",
  },
];


export const initialRoles: Role[] = [
  {
    id: "ROLE001",
    name: "Admin",
    description: "Full system access with all permissions",
    permissions: ["read", "write", "delete", "manage_users", "manage_roles"],
    usersCount: 2,
  },
  {
    id: "ROLE002",
    name: "Editor",
    description: "Can edit content but cannot manage users or roles",
    permissions: ["read", "write"],
    usersCount: 3,
  },
  {
    id: "ROLE003",
    name: "Viewer",
    description: "Read-only access to the system",
    permissions: ["read"],
    usersCount: 3,
  },
  {
    id: "ROLE004",
    name: "Manager",
    description: "Can manage content and users but not roles",
    permissions: ["read", "write", "delete", "manage_users"],
    usersCount: 0,
  },
  {
    id: "ROLE005",
    name: "Support",
    description: "Customer support access",
    permissions: ["read", "write"],
    usersCount: 0,
  },
]

export const allPermissions: Permission[] = [
  { id: "read", name: "Read Content" },
  { id: "write", name: "Write Content" },
  { id: "delete", name: "Delete Content" },
  { id: "manage_users", name: "Manage Users" },
  { id: "manage_roles", name: "Manage Roles" },
]
