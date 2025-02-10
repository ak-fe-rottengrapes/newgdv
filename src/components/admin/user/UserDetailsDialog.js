'use client'
import { PulseLoader } from 'react-spinners'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const UserDetailsDialog = ({ open, setOpen, loading, user, rejectLoader, approveLoading, rejectUserHandler, onSubmit }) => {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="bg-[#2b3a4a] border border-gray-500 shadow-lg text-white max-w-2xl">
                <DialogHeader className=" border-gray-500 pb-4">
                    <DialogTitle className="text-xl font-semibold text-white">User Details</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                    {loading ? (
                        <div className="border rounded-md p-2 shadow-md border-gray-600 animate-pulse">
                            <div className="grid grid-cols-2 gap-2">
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <div key={index} className="flex justify-between border p-2 flex-col rounded-md shadow-md border-gray-600 pb-2">
                                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                                        <div className="h-3 bg-gray-600 rounded w-3/4"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                                <div className="h-10 bg-gray-700 rounded w-[140px]"></div>
                                <div className="h-10 bg-gray-700 rounded w-[140px]"></div>
                            </div>
                        </div>
                    ) : (
                        user && (
                            <div className="text-gray-200 border-gray-500 ">
                                <div className='border rounded-md p-2 shadow-md border-gray-600'>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { label: "ID", value: user.id },
                                            { label: "Name", value: `${user.first_name} ${user.last_name}` },
                                            { label: "Email", value: user.email },
                                            { label: "Mobile", value: `${user.country_code} ${user.mobile}` },
                                            { label: "Address", value: user.address },
                                            { label: "Company Name", value: user.company_name },
                                            { label: "Company Business", value: user.company_business },
                                            { label: "Company Type", value: user.company_type },
                                            { label: "Profile Type", value: user.profile_type },
                                            { label: "Job Title", value: user.job_title },
                                            {
                                                label: "Status",
                                                value: (
                                                    <span className={user.is_active ? "text-green-400" : "text-red-400"}>
                                                        {user.is_active ? "Active" : "Inactive"}
                                                    </span>
                                                ),
                                            },
                                            {
                                                label: "Profile Complete",
                                                value: (
                                                    <span className={user.profile_complete ? "text-green-400" : "text-yellow-400"}>
                                                        {user.profile_complete ? "Yes" : "No"}
                                                    </span>
                                                ),
                                            },
                                        ].map((item, index) => (
                                            <div key={index} className="flex justify-between border p-2 flex-col rounded-md shadow-md border-gray-600 pb-2 ">
                                                <strong className="text-white text-sm">{item.label}:</strong>
                                                <span className="text-gray-200 text-xs">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {!user.profile_complete ? (
                                    <div className='flex justify-end gap-4 mt-6'>
                                        <span>Profile Is Incomplete</span>
                                    </div>
                                ) : (
                                    <div className="flex justify-end gap-4 mt-6">
                                        <Button
                                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors w-[140px] flex justify-center items-center"
                                            onClick={() => rejectUserHandler(user.id)}
                                        >
                                            {rejectLoader ? <PulseLoader size={8} color="#ffffff" /> : "Reject User"}
                                        </Button>

                                        <Button
                                            className="bg-green-600 text-white rounded hover:bg-green-700 transition-colors px-4 py-2 w-[140px] flex justify-center items-center"
                                            onClick={() => onSubmit(user.id)}
                                        >
                                            {approveLoading ? <PulseLoader size={8} color="#ffffff" /> : "Approve User"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UserDetailsDialog; 