'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import {
  Home,
  ShoppingCart,
  Bell,
  List,
  Search,
  User,
  PanelRightOpen,
  PanelRightClose,
  Menu,
  // MapPlus 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signOut } from 'next-auth/react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { resetPassword } from '../services/profile/api';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export function Sidebar() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [email, setEmail] = useState(session?.user?.email || "");
  const [new_password, setNew_password] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const routes = [
    {
      icon: Home,
      label: 'Place Order',
      href: '/user/order',
    },
    {
      icon: Bell,
      label: 'Notifications',
      href: '/user/notification',
    },
    {
      icon: List,
      label: 'Order History',
      href: '/user/orderList',
    },
    {
      icon: Search,
      label: 'Search Products',
      href: '/user/searchproduct',
    },
    {
      icon: ShoppingCart,
      label: 'Cart',
      href: '/user/AddToCart',
    }
  ];

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      const data = {
        email: email,
        new_password: new_password,
      }
      await resetPassword(session?.user?.access, data);
      toast({
        title: 'Success',
        description: 'Password reset successfully',
        status: 'success',
        duration: 2000,
        className: 'bg-green-100 text-black',
      });
      setOpen(false);
    } catch (error) {
      console.log(error);
      toast({
        title: 'Error',
        description: error.message,
        variant: "destructive",
        status: 'error',
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <nav className={cn(
        "fixed md:static h-full border-r bg-[#212B35] text-white transition-all duration-300 z-50",
        "flex flex-col",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        // Mobile styles
        "md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex-1">
          <div className="flex h-16 items-center justify-between px-3 border-b border-gray-700">
            {!isCollapsed && <h2 className="text-lg font-semibold">Dashboard</h2>}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsCollapsed(!isCollapsed);
                setIsMobileOpen(false);
              }}
              className={cn(
                "ml-auto text-white hover:bg-[#2b3a4a] hover:text-white md:flex",
                isCollapsed && "rotate-180",
                "hidden" // Hide on mobile
              )}
            >
              {isCollapsed ? (
                <PanelRightOpen className="h-5 w-5" />
              ) : (
                <PanelRightClose className="h-5 w-5" />
              )}
            </Button>
          </div>
          <div className="space-y-4 py-4">
            <div className="px-3">
              <div className="space-y-1">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "flex items-center rounded-lg transition-colors",
                        isCollapsed ? "justify-center py-2" : "px-3 py-2",
                        pathname === route.href
                          ? "bg-[#2b3a4a] text-white"
                          : "text-gray-300 hover:bg-[#2b3a4a] hover:text-white"
                      )}
                      title={isCollapsed ? route.label : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <span className="ml-3 text-sm">{route.label}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px] bg-[#212B35] text-white border border-gray-700 rounded-lg">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Enter your new password below. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input id="email" value={email} className="col-span-3" onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new_password" className="text-right">
                  New Password
                </Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={new_password}
                  onChange={(e) => setNew_password(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" onClick={handleResetPassword}>
                {isLoading ? "Loading..." : "Reset Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Profile Section */}
        <div className={cn(
          "border-t border-gray-700 p-3 flex items-center",
          isCollapsed ? "justify-center" : "gap-3"
        )}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-[#35495e] transition">
                <div className="w-8 h-8 rounded-full bg-[#2b3a4a] flex items-center justify-center text-white">
                  <User className="h-5 w-5" />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-medium text-white">{`${session?.user?.first_name} ${session?.user?.last_name}`}</span>
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="bg-[#212B35] text-white p-4 rounded-lg shadow-lg" align="end">
              {/* User Info */}
              <div className="mb-3 border-b border-gray-600 flex flex-col items-center pb-3">
                <span className="text-md font-semibold text-white">{`${session?.user?.first_name} ${session?.user?.last_name}`}</span>
                <p className="text-xs text-gray-400">{session?.user?.email}</p>
              </div>

              {/* Menu Actions */}
              <div className="flex flex-col gap-2">
                <Button
                  className="w-full text-blue-400 hover:bg-[#3c4f63] hover:text-white transition"
                  variant="ghost"
                  onClick={() => { setOpen(true); }}
                >
                  Reset Password
                </Button>
                <Button
                  className="w-full text-red-400 hover:bg-[#3c4f63] hover:text-white transition"
                  variant="ghost"
                  onClick={() => signOut({ callbackUrl: '/' })}
                >
                  Logout
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="fixed top-0 left-0 right-0 bg-[#212B35] border-b border-gray-700 md:hidden z-50">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo Section */}
          <div className="flex items-center">
            <span className="text-white font-bold text-xl">Logo</span>
          </div>

          {/* Right Side Actions */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileOpen(true)}
            className="text-white hover:bg-[#2b3a4a]"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Add padding to content below navbar */}
      <div className="h-16 md:hidden" />
    </>
  );
}