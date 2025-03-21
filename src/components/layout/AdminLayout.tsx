import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { LogOut, Menu, Shield, User } from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import Logo from "../global/logo/Logo";
import { useAuth } from "@/context/AuthProvider";

const navigation = [
  { name: "Users", href: "/admin/dashboard", icon: User },
  { name: "Roles", href: "/admin/roles", icon: Shield },
];

export default function AdminLayout() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const MobileNavContent = ({ isMobile = false }) => (
    <>
      <Logo isMobile={isMobile} />
      <nav
        className={cn(
          "flex gap-1",
          isMobile ? "flex-col px-2" : "items-center"
        )}
      >
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                location.pathname === item.href &&
                  "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
              )}
              onClick={() => setOpen(false)}
            >
              {isMobile && <Icon className="h-4 w-4" />}
              {item.name}
            </Link>
          );
        })}
        {isMobile && (
          <button
            onClick={() => {
              signOut();
              setOpen(false);
            }}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        )}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50/90 dark:bg-gray-900/90">
      <div className="flex flex-col">
        {/* Desktop Navbar */}

        <div className="sticky top-0 z-10 w-full flex  items-center justify-between  border-b bg-white dark:bg-gray-950">
          <header className="w-full md:max-w-screen-lg lg:max-w-screen-2xl mx-auto flex h-full items-center justify-between  gap-2 md:gap-6  px-2 md:px-4 lg:px-6 ">
            {/* Desktop Navigation */}

            <div className="">
              <Logo isMobile={false} />
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-6">
              <nav className="flex">
                {navigation.map((item) => {
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        location.pathname === item.href &&
                          " text-gray-900"
                      )}
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="hidden lg:flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="User avatar"
                      />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile Menu Button */}

            <div className="lg:hidden ml-auto">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="  ">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="mt-6 flex h-full flex-col gap-4">
                    <MobileNavContent isMobile={true} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
        </div>

        <main className="flex-1 p-6 w-full  md:max-w-screen-lg lg:max-w-screen-2xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

