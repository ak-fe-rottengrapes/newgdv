'use client'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { AddEmployee } from './AddEmployee'
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { getEmployeeList, DeleteMultipleEmployee } from '@/components/services/admin/employeeList/api'
import { useToast } from '@/hooks/use-toast'
import DataTable from 'react-data-table-component'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { PulseLoader } from 'react-spinners'

export const EmployeeList = () => {
    const { toast } = useToast();
    const { data: session } = useSession();
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deleteLoader, setDeleteLoader] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchEmployees = async () => {
        try {
            const response = await getEmployeeList(session?.user?.access);
            setEmployees(response);
            setFilteredEmployees(response);
            console.log(response);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                variant: 'destructive',
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        if (session?.user?.access) {
            fetchEmployees();
        }
    }, [session?.user?.access])

    useEffect(() => {
        const filtered = employees.filter(employee =>
            employee.first_name.toLowerCase().includes(search.toLowerCase()) ||
            employee.last_name.toLowerCase().includes(search.toLowerCase()) ||
            employee.email.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredEmployees(filtered);
    }, [search, employees]);

    const columns = [
        {
            name: 'First Name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
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

    const handleSelect = ({ selectedRows }) => {
        const selectedIds = selectedRows.map(row => row.id);
        setSelectedUsers(selectedIds);
    };

    const handleDelete = async () => {
        if (session?.user?.access) {
            try {
                if (selectedUsers.length === 0) {
                    toast({
                        title: 'Error',
                        description: 'Please select at least one employee to delete',
                        status: 'error',
                        duration: 2000,
                        variant: 'destructive',
                    });
                    return;
                }
                setDeleteLoader(true);
                const response = await DeleteMultipleEmployee(session?.user?.access, { user_ids: selectedUsers });
                toast({
                    title: 'Success',
                    description: 'Selected employees deleted successfully',
                    status: 'success',
                    duration: 2000,
                    className: 'bg-green-200',
                });
                setEmployees(employees.filter(emp => !selectedUsers.includes(emp.id)));
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message,
                    status: 'error',
                    duration: 2000,
                    variant: "destructive",
                });
            } finally {
                setSelectedUsers([]);
                setDeleteLoader(false);
                setConfirmOpen(false);
            }
        }
    };

    return (
        <div className='flex flex-col items-center justify-center p-2'>
            <div className='flex justify-between items-center border rounded-md border-gray-500 shadow-lg p-2 w-full bg-[#2b3a4a]'>
                <div>
                    <AddEmployee employees={employees} setEmployees={setEmployees} />
                </div>
                <div className='text-base font-semibold text-white'>
                    <span>
                        Employees
                    </span>
                </div>
                <div className='flex gap-2 items-center'>
                    <Trash2 onClick={() => setConfirmOpen(true)} size={16} color='#ffffff' />
                </div>
            </div>
            <div className='flex flex-col  p-2 border rounded-md h-[calc(100vh-143px)] border-gray-500 shadow-lg w-full bg-[#2b3a4a] mt-2'>
                <div className='flex justify-end items-center'>
                    <Input 
                        placeholder='Search Employees' 
                        className='w-1/3'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className='border border-gray-500 rounded-md mt-2 h-[calc(100vh-200px)] overflow-y-auto'>
                    {loading ? (
                        <div className='flex justify-center items-center h-full'>
                            <PulseLoader size={8} color="#ffffff" />
                        </div>
                    ) : (
                        <DataTable
                            columns={columns}
                            data={filteredEmployees}
                            customStyles={customStyles}
                            pagination
                            selectableRows
                            onSelectedRowsChange={handleSelect}
                        />
                    )}
                </div>
            </div>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="bg-[#2b3a4a] border border-gray-500 shadow-lg text-white max-w-md">
                    <DialogHeader className="border-gray-500">
                        <DialogTitle className="text-xl font-semibold text-white">Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="text-white">
                        Are you sure you want to delete the selected employees?
                    </div>
                    <DialogFooter className="flex justify-end gap-4 mt-6">
                        <Button
                            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            onClick={handleDelete}
                        >
                            {deleteLoader ? <PulseLoader size={8} color="#ffffff" /> : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
