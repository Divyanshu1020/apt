import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthProvider";
import {
  Briefcase,
  Check,
  ChevronRight,
  Settings,
  Shield,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

// Define role types with their associated icons and routes
const roleConfig = {
  ROLE_ADMIN: {
    title: "Admin Dashboard",
    description: "Full system access with all permissions",
    icon: Shield,
    route: "/admin/dashboard",
    color: "bg-primary/10 text-primary border-primary/30",
  },
  ROLE_MANAGER: {
    title: "Manager Dashboard",
    description: "Manage teams and projects",
    icon: Briefcase,
    route: "/manager",
    color: "bg-info/10 text-info border-info/30",
  },
  ROLE_HR: {
    title: "HR Dashboard",
    description: "Manage employees and recruitment",
    icon: Users,
    route: "/hr",
    color: "bg-success/10 text-success border-success/30",
  },
  ROLE_SUPPORT: {
    title: "Support Dashboard",
    description: "Customer support and ticket management",
    icon: Settings,
    route: "/support",
    color: "bg-warning/10 text-warning border-warning/30",
  },
  ROLE_USER: {
    title: "Home page",
    description: "Access to user features",
    icon: User,
    route: "/",
    color: "bg-foreground/10 text-foreground border-foreground/30",
  },
  ROLE_SUPERVISOR: {
    title: "Supervisor Dashboard",
    description: "Oversee operations and manage staff",
    icon: ChevronRight,
    route: "/supervisor",
    color: "bg-secondary/10 text-secondary border-secondary/30",
  },
};

// Mock user with multiple roles

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  const roleNames =   user?.roles.map((role: { id: string; name: string }) => role.name);
  const userRoles =
  roleNames.filter(
      (role: string) => role in roleConfig
    ) || [];

  if (userRoles.length === 0) {
    navigate(location.state?.from?.pathname || "/", { replace: true });
  }

  const updatedRoles = ["ROLE_USER", ...userRoles];

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;

    setIsLoading(true);

    // Get the route for the selected role
    const route = roleConfig[selectedRole as keyof typeof roleConfig].route;

    // Navigate to the selected route
    navigate(route, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-accent/40 via-background to-background -z-10"></div>
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="text-center border-b pb-6">
          <CardTitle className="text-2xl font-bold">
            Welcome, {user.name}
          </CardTitle>
          <CardDescription>Please select a role to continue</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {updatedRoles.map((role: string) => {
              const roleData = roleConfig[role as keyof typeof roleConfig];
              const RoleIcon = roleData.icon;

              return (
                <div
                  key={role}
                  className={`
                      relative rounded-lg border p-4 cursor-pointer transition-all
                      ${
                        selectedRole === role
                          ? `ring-2 ring-primary ${roleData.color}`
                          : "hover:border-primary/50 hover:bg-muted/50"
                      }
                    `}
                  onClick={() => handleRoleSelect(role)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`
                        h-12 w-12 rounded-full flex items-center justify-center shrink-0
                        ${roleData.color}
                      `}
                    >
                      <RoleIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">{roleData.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {roleData.description}
                      </p>
                    </div>
                  </div>
                  {selectedRole === role && (
                    <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Loading..." : "Continue"}
              {!isLoading && <ChevronRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
