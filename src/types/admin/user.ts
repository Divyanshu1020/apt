export type UserStatus = 'active' | 'inactive';
export type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Manager' | 'Support';

export interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  roles: UserRole[];
  registeredDate: string;
  updatedDate: string;
}