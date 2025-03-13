export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    usersCount: number;
  }
  
  export interface Permission {
    id: string;
    name: string;
  }