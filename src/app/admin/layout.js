// 'use client'

// import { AdminSidebar } from "../../components/shared/AdminSidebar"

// export default function AdminLayout({ children }) {
//     return (
//         <div className="relative h-screen flex">
//             <div className="absolute md:relative z-50">
//                 <AdminSidebar />
//             </div>
//             <div className="flex-1 flex flex-col">
//                 <main className="flex-1 flex flex-col md:flex-row pt-16 md:pt-0">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     )
// }
'use client'

import { AdminSidebar } from "../../components/shared/AdminSidebar"
import AdminNavbar from "@/components/shared/AdminNavbar"
import AdminProvider from "../context/AdminContext";

export default function AdminLayout({ children }) {
    return (
        <AdminProvider>
            <div className="">
                <AdminNavbar />
                <div className="flex">
                    <AdminSidebar />
                    <main className="flex-grow">
                        {children}
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}