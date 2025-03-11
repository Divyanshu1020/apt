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
  {
    id: "USR007",
    name: "David Miller",
    email: "david.m@example.com",
    status: "active",
    roles: ["Editor"],
    registeredDate: "2023-03-15T10:20:00",
    updatedDate: "2023-06-05T14:30:00",
  },
];