
'use client'

import AdminNavbar from "@/components/employee/menus/Navbar";
import { Sidebar } from "@/components/employee/menus/sidebar";
import EmployeeProvider from "@/providers/EmployeeProvider";



export default function AdminLayout({ children }) {
    return (
        <div >
            <EmployeeProvider>
            <AdminNavbar/>
            <div className="flex">
                <Sidebar/>
                <main className="flex-grow">
                    {children}
                </main>
            </div>
            </EmployeeProvider>
        </div>
    );
}