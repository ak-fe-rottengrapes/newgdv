'use client'
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { aprroveUser, getUserDetails, getUserList, rejectUser, DeleteMultipleUser } from '@/components/services/admin/userlist/api'
import DataTable from 'react-data-table-component'
import { PulseLoader } from 'react-spinners'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Dialog as ConfirmDialog, DialogContent as ConfirmDialogContent, DialogHeader as ConfirmDialogHeader, DialogTitle as ConfirmDialogTitle, DialogFooter as ConfirmDialogFooter } from "@/components/ui/dialog"

const User = () => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const [userList, setUserList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("All");
    const [search, setSearch] = useState("");

    const [selectedUsers, setSelectedUsers] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchUserList = async (accessToken) => {
        try {
            setIsLoading(true);
            const response = await getUserList(accessToken);
            setUserList(response);
        } catch (error) {
            console.error("Failed to fetch user list: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (session?.user?.access) {
            fetchUserList(session.user.access);
        }
    }, [session?.user?.access]);

    useEffect(() => {
        if (filter === "All") {
            setFilteredList(userList);
        } else {
            const isActive = filter === "Active";
            setFilteredList(userList.filter(user => user.is_active === isActive));
        }
    }, [filter, userList]);

    useEffect(() => {
        setFilteredList(userList.filter(user =>
            `${user.first_name} ${user.last_name}`.toLowerCase().includes(search.toLowerCase())
        ));
    }, [search, userList]);

    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
            width: "70px"
        },
        {
            name: "Name",
            selector: row => `${row.first_name} ${row.last_name}`,
            sortable: true,
            width: "150px"
        },
        {
            name: "Location",
            selector: row => row.address,
            sortable: true,
            width: "150px"
        },
        {
            name: "Mobile Phone",
            selector: row => `${row.country_code} ${row.mobile}`,
            sortable: true
        },
        {
            name: "Email Address",
            selector: row => row.email,
            sortable: true
        },
        {
            name: "Status",
            selector: row => row.is_active ? "Active" : "Inactive",
            sortable: true,
            width: "80px"
        },
        {
            name: "Profile Type",
            selector: row => row.profile_type,
            sortable: true,
            width: "120px"
        },
        {
            name: "Company Name",
            selector: row => row.company_name,
            sortable: true,
            width: "100px"
        },
        {
            name: "Company Type",
            selector: row => row.company_type,
            sortable: true,
            width: "100px"
        },
    ];
    const customStyles = {
        table: {
            style: {
                backgroundColor: '#3e4f61',
            },
        },
        rows: {
            style: {
                backgroundColor: '#2b3a4a',
                color: 'white',
                '&:hover': {
                    backgroundColor: '#35475a', // Slightly lighter than #2b3a4a for subtle contrast
                },
            },
        },
        headCells: {
            style: {
                backgroundColor: '#2b3a4a',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '14px',
            },
        },
        pagination: {
            style: {
                backgroundColor: '#2b3a4a',
                color: 'white',
            },
        },
    };

    const onClickHandler = (id) => {
        setUserId(id);
        setOpen(true);
        console.log("User ID: ", id);
    };

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const fetchUserDetails = async () => {
        if (session?.user?.access) {
            try {
                setLoading(true)
                const data = await getUserDetails(session.user.access, userId);
                setUser(data);
                setLoading(false)
            } catch (error) {
                console.log("Failed to fetch user data: ", error.response?.data || error.message)
                setLoading(false)
            }
        }
    }
    useEffect(() => {
        if (userId) {
            fetchUserDetails();
        }
    }, [session?.user?.access, userId])

    const [approveLoading, setApproveLoading] = useState(false);

    const onSubmit = async () => {
        if (session?.user?.access) {
            try {
                setApproveLoading(true)
                const response = await aprroveUser(session?.user?.access, userId)
                toast({
                    title: 'Success',
                    description: response.message,
                    status: 'success',
                    duration: 2000,
                    className: 'bg-green-200',
                })
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    variant: "destructive",
                })
            } finally {
                setApproveLoading(false);
            }
        } else {
            toast({
                title: 'Error',
                description: 'Session expired. Please login again',
                status: 'error',
                duration: 2000,
                variant: "destructive",
            })
        }
    }

    const [rejectLoader, setRejectLoader] = useState(false);
    const rejectUserHandler = async () => {
        if (session?.user?.access) {
            try {
                setRejectLoader(true);
                const response = await rejectUser(session.user.access, userId);
                toast({
                    title: 'Success',
                    description: response.message,
                    status: 'success',
                    duration: 2000,
                    className: 'bg-green-200',
                })
                setFilteredList(filteredList.filter(user => user.id !== userId));
                setOpen(false);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    variant: "destructive",
                })
            } finally {
                setRejectLoader(false)
            }
        } else {
            toast({
                title: 'Error',
                description: 'Session expired. Please login again',
                status: 'error',
                duration: 2000,
                variant: "destructive",
            })
        }
    }


    // Add selection handler
    const handleSelect = ({ selectedRows }) => {
        const selectedIds = selectedRows.map(row => row.id);
        setSelectedUsers(selectedIds);
    };

    const handleDelete = async () => {
        if (session?.user?.access) {
            try {
                const response = DeleteMultipleUser(session?.user?.access, { user_ids: selectedUsers });
                if (response) {
                    toast({
                        title: 'Success',
                        description: response.message,
                        status: 'success',
                        duration: 2000,
                        className: 'bg-green-200',
                    })
                }
                setFilteredList(filteredList.filter(user => !selectedUsers.includes(user.id)));
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    variant: "destructive",
                })
            } finally {
                setSelectedUsers([]);
            }
        }
    }

    const handleDeleteConfirm = () => {
        handleDelete();
        setConfirmOpen(false);
    };

    useEffect(() => {
        console.log("Selected users:", selectedUsers);
    }, [selectedUsers]);

    const ComboboxDemo = () => {
        const [open, setOpen] = useState(false);

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[110px] text-white hover:text-white hover:bg-[#303d4b] bg-[#3e4f61] justify-between">
                        {filter}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0 ">
                    <Command className='bg-[#3e4f61] text-white'>
                        <CommandInput placeholder="Search..." />
                        <CommandList>
                            <CommandEmpty>No status found.</CommandEmpty>
                            <CommandGroup className='text-white'>
                                {["All", "Active", "Inactive"].map(status => (
                                    <CommandItem
                                        key={status}
                                        value={status}
                                        onSelect={() => {
                                            setFilter(status);
                                            setOpen(false);
                                        }}
                                    >
                                        {status}
                                        <Check className={cn("ml-auto", filter === status ? "opacity-100" : "opacity-0")} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        );
    };

    return (
        <div className='flex flex-col items-center justify-center p-2'>
            <div className='flex justify-between items-center border rounded-md border-gray-500 shadow-lg p-2 w-full bg-[#2b3a4a]'>
                <div><ComboboxDemo /></div>
                <div className='text-base font-semibold text-white'>
                    <span>
                        Users
                    </span>
                </div>
                <div className='flex gap-2 items-center'>
                    <Trash2 onClick={() => setConfirmOpen(true)} size={16} color='#ffffff' />
                </div>
            </div>

            <div className='flex flex-col overflow-y-auto h-[calc(100vh-150px)] border rounded-md border-gray-500 shadow-lg p-2 w-full mt-2 bg-[#3e4f61]'>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="bg-[#2b3a4a] border border-gray-500 shadow-lg text-white max-w-2xl">
                        <DialogHeader className=" border-gray-500 pb-4">
                            <DialogTitle className="text-xl font-semibold text-white">User Details</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            {loading ? (
                                <div className="flex justify-center items-center w-full h-full p-4">
                                    <PulseLoader size={10} color="#ffffff" />
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
                <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <ConfirmDialogContent className="bg-[#2b3a4a] border border-gray-500 shadow-lg text-white max-w-md">
                        <ConfirmDialogHeader className="border-gray-500 pb-4">
                            <ConfirmDialogTitle className="text-xl font-semibold text-white">Confirm Delete</ConfirmDialogTitle>
                        </ConfirmDialogHeader>
                        <div className="mt-4 text-white">
                            Are you sure you want to delete the selected users?
                        </div>
                        <ConfirmDialogFooter className="flex justify-end gap-4 mt-6">
                            <Button
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                                onClick={handleDeleteConfirm}
                            >
                                Delete
                            </Button>
                        </ConfirmDialogFooter>
                    </ConfirmDialogContent>
                </ConfirmDialog>
                <div className='flex w-full justify-end items-center  p-2'>
                    <Input
                        className='w-1/3 border-gray-500'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name..."
                    />
                </div>
                <div className='border rounded-md border-gray-500 shadow-lg w-full bg-[#2b3a4a]'>
                    {isLoading ? (
                        <div className="w-full h-[calc(100vh-155px)]">
                            <div className='flex-1  m-2 h-10 bg-gray-700 rounded mx-1 animate-pulse'></div>
                            <div className='m-2 flex flex-col gap-3'>
                                {[1, 2, 3, 4, 5].map((_, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className="w-full  h-10 bg-gray-700 rounded my-1 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                            <div className="flex justify-between items-center bg-[#2b3a4a] p-3 rounded-b">
                                <div className="w-20 h-6 bg-gray-700 rounded animate-pulse"></div>
                                <div className="flex gap-2">
                                    <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                                    <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                                    <div className="w-6 h-6 bg-gray-700 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ) : (

                        <DataTable
                            columns={columns}
                            data={filteredList}
                            pagination
                            pointerOnHover
                            selectableRows
                            onSelectedRowsChange={handleSelect}
                            onRowClicked={(row) => onClickHandler(row.id)}
                            customStyles={customStyles}
                            clearSelectedRows={false}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default User