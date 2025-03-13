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
import {
  Briefcase,
  LogOut,
  Menu,
  ShoppingCart,
  Store,
  User,
} from "lucide-react";
import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Logo from "../global/logo/Logo";
import SearchBox from "./components/SearchBox";
import  Footer  from "./Footer";

const navigation = [
  {name: "Account", href: "/account", icon: User},
  { name: "Orders", href: "/orders", icon: ShoppingCart},
  { name: "Products", href: "/products", icon: Store },
  { name: "Services", href: "/services", icon: Briefcase },
];

export default function UserLayout() {
  const [userIsLoggedIn] = useState(true);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const MobileNavContent = () => (
    <div className="flex flex-col gap-2 h-full pb-4">
      <Logo isMobile={true} />
      <nav
        className={cn(
          "flex gap-1 flex-col px-2",
        )}
      >
        {userIsLoggedIn && navigation.map((item) => {
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
              {<Icon className="h-4 w-4" />}
              {item.name}
            </Link>
          );
        })}
      </nav>
      {userIsLoggedIn && (
          <button
            onClick={() => {
              setOpen(false);
              navigate("/auth/sign-in");
            }}
            className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        )}
        {!userIsLoggedIn && (
          <Button
            onClick={() => {
              setOpen(false);
              navigate("/auth/sign-in");
            }}
            className=" mt-auto flex items-center gap-2 rounded-lg px-3 py-2  transition-all "
          >
            <User className="h-4 w-4" />
            Sign in
          </Button>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/90 dark:bg-gray-900/90">
      <div className="flex flex-col">
        {/* Desktop Navbar */}

        <div className="sticky top-0 w-full flex  items-center justify-between  border-b bg-white dark:bg-gray-950">
          <header className="w-full md:max-w-screen-lg lg:max-w-screen-2xl mx-auto flex h-full items-center justify-between  gap-2 md:gap-6  px-2 md:px-4 lg:px-6 ">
            {/* Desktop Navigation */}

            <Logo isMobile={false} />

            <SearchBox />

            <button className="flex items-center gap-2">
              <ShoppingCart size={24} color="#7b7b7b" />
              <span className="text-[#7b7b7b] font-medium text-lg">Cart</span>
            </button>

            {!userIsLoggedIn && (
              <>
                <Button variant="text" className="hidden md:flex">
                  <span className="text-[#7b7b7b] font-medium text-lg">
                    Sign in
                  </span>
                </Button>
                <Button variant="default" className="hidden md:flex bg-blue-600">
                  <span className="text-[#ffffff]  font-medium text-lg">
                    Sign up
                  </span>
                </Button>
              </>
            )}

            {userIsLoggedIn && (
              <div className="hidden md:flex items-center gap-4">
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
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          John Doe
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          john@example.com
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
                    <DropdownMenuItem>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* Mobile Menu Button */}

            <div className="md:hidden ml-auto">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild className="  ">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Menu size={24}  />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-64">
                  <div className="mt-6 flex h-full flex-col gap-4">
                    <MobileNavContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </header>
        </div>

        <main className="flex-1 p-6 w-full min-h-screen md:max-w-screen-lg lg:max-w-screen-2xl mx-auto">
          <Outlet />
        </main>

        <Footer/>
      </div>
    </div>
  );
}
