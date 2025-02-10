'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';

const AdminNavbar = ({ toggleSidebar }) => {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-700 left-0 right-0 bg-[#212B35] text-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 h-16">
        {/* Logo and Title */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleSidebar} className="md:hidden text-white">
            <Menu className="h-6 w-6" />
          </Button>
          <Link href="/admin" className="flex items-center gap-2">
            <span>LOGO</span>
          </Link>
        </div>
            <span className="text-lg font-semibold">Admin Panel</span>

        {/* User Info */}
        <div className="flex items-center gap-3">
          <span className="text-sm">{session?.user?.first_name} {session?.user?.last_name}</span>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
